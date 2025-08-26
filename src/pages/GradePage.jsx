import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
    TablePagination,
} from "@mui/material";
import { Delete, Edit, FileDownload } from "@mui/icons-material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    Legend,
    BarChart,
    Bar,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";
import {
    getGrades, createGrade, updateGrade, deleteGrade, exportGradesCSV
} from '../api/Grade';

const SUBJECTS = [
    "Mathematics",
    "English",
    "Kiswahili",
    "Biology",
    "Chemistry",
    "Physics",
    "History",
    "Geography",
    "Business",
    "CRE",
];

const GRADE_POINTS = {
    A: 12,
    "A-": 11,
    "B+": 10,
    B: 9,
    "B-": 8,
    "C+": 7,
    C: 6,
    "C-": 5,
    "D+": 4,
    D: 3,
    "D-": 2,
    E: 1,
};

const GRADES = Object.keys(GRADE_POINTS);

function average(nums) {
    if (!nums.length) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function toKey({ form, term }) {
    return `F${form}T${term}`;
}

export default function GradePage() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(1);
    const [term, setTerm] = useState(1);
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [grade, setGrade] = useState("B");
    const [editingId, setEditingId] = useState(null);
    const [filterForm, setFilterForm] = useState("all");
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Load grades from backend
    const loadGrades = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getGrades();
            setEntries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load grades:', error);
            setAlert({
                open: true,
                message: 'Failed to load grades from server',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGrades();
    }, [loadGrades]);

    // Build a flat id for each entry - use backend _id or id
    const rows = entries.map((e, idx) => ({
        id: e.id || e._id || idx + 1,
        originalIndex: idx,
        ...e
    }));

    const filteredRows = useMemo(() => {
        if (filterForm === "all") return rows;
        return rows.filter((r) => r.form === Number(filterForm));
    }, [rows, filterForm]);

    // Add paginated rows
    const paginatedRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filteredRows.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Reset page when filter changes
    useEffect(() => {
        setPage(0);
    }, [filterForm]);

    // Trend by academic period (Form-Term), averaged across subjects
    const trendData = useMemo(() => {
        // group by F{form}T{term}
        const map = new Map();
        for (const r of rows) {
            const k = toKey(r);
            const arr = map.get(k) || [];
            arr.push(GRADE_POINTS[r.grade] || 0);
            map.set(k, arr);
        }
        const items = [];
        for (let f = 1; f <= 4; f++) {
            for (let t = 1; t <= 3; t++) {
                const k = `F${f}T${t}`;
                const avg = average(map.get(k) || []);
                items.push({ period: `Form ${f} T${t}`, avg: Number(avg.toFixed(2)) });
            }
        }
        return items;
    }, [rows]);

    // Per-subject averages (optionally filter by Form)
    const subjectBarData = useMemo(() => {
        const map = new Map();
        SUBJECTS.forEach((s) => map.set(s, []));
        for (const r of filteredRows) {
            const arr = map.get(r.subject) || [];
            arr.push(GRADE_POINTS[r.grade] || 0);
            map.set(r.subject, arr);
        }
        return SUBJECTS.map((s) => ({ subject: s, avg: Number(average(map.get(s) || []).toFixed(2)) }));
    }, [filteredRows]);

    // Radar snapshot for a selected (Form, Term)
    const [radarForm, setRadarForm] = useState(1);
    const [radarTerm, setRadarTerm] = useState(1);
    const radarData = useMemo(() => {
        const bySubject = new Map();
        SUBJECTS.forEach((s) => bySubject.set(s, []));
        for (const r of rows) {
            if (r.form === Number(radarForm) && r.term === Number(radarTerm)) {
                const arr = bySubject.get(r.subject) || [];
                arr.push(GRADE_POINTS[r.grade] || 0);
                bySubject.set(r.subject, arr);
            }
        }
        return SUBJECTS.map((s) => ({ subject: s, score: Number(average(bySubject.get(s) || []).toFixed(2)) }));
    }, [rows, radarForm, radarTerm]);

    const overallAvg = useMemo(() => {
        const pts = rows.map((r) => GRADE_POINTS[r.grade] || 0);
        return Number(average(pts).toFixed(2));
    }, [rows]);

    const kpis = useMemo(() => {
        const perForm = { 1: [], 2: [], 3: [], 4: [] };
        rows.forEach((r) => perForm[r.form].push(GRADE_POINTS[r.grade] || 0));
        return [1, 2, 3, 4].map((f) => ({
            form: f,
            avg: Number(average(perForm[f]).toFixed(2)),
        }));
    }, [rows]);

    function resetForm() {
        setForm(1);
        setTerm(1);
        setSubject(SUBJECTS[0]);
        setGrade("B");
        setEditingId(null);
    }

    async function handleAddOrUpdate(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = { form: Number(form), term: Number(term), subject, grade };
            if (editingId != null) {
                await updateGrade(editingId, payload);
                setAlert({
                    open: true,
                    message: 'Grade updated successfully!',
                    severity: 'success'
                });
            } else {
                await createGrade(payload);
                setAlert({
                    open: true,
                    message: 'Grade added successfully!',
                    severity: 'success'
                });
            }
            await loadGrades();
            resetForm();
        } catch (error) {
            console.error('Failed to save grade:', error);
            setAlert({
                open: true,
                message: 'Failed to save grade',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(row) {
        setForm(row.form);
        setTerm(row.term);
        setSubject(row.subject);
        setGrade(row.grade);
        setEditingId(row.id);
    }

    async function handleDelete(row) {
        try {
            setLoading(true);
            await deleteGrade(row.id);
            setAlert({
                open: true,
                message: 'Grade deleted successfully!',
                severity: 'success'
            });
            await loadGrades();
            if (editingId === row.id) resetForm();
        } catch (error) {
            console.error('Failed to delete grade:', error);
            setAlert({
                open: true,
                message: 'Failed to delete grade',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    async function exportCSV() {
        try {
            const blob = await exportGradesCSV();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "grades_export.csv";
            a.click();
            URL.revokeObjectURL(url);
            setAlert({
                open: true,
                message: 'Grades exported successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to export grades:', error);
            // Fallback to client-side export
            const header = ["Form", "Term", "Subject", "Grade", "Points"];
            const lines = [header.join(",")];
            for (const r of rows) {
                lines.push([r.form, r.term, r.subject, r.grade, GRADE_POINTS[r.grade] || 0].join(","));
            }
            const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "grades_export.csv";
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    const handleCloseAlert = () => setAlert({ ...alert, open: false });

    const cardVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
    };

    if (loading && entries.length === 0) {
        return (
            <Container maxWidth="xl" style={{ padding: 16 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" style={{ padding: 16 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={900}>
                   Professor Benjamin Kimani Njoroge, Thika Boys High School GradePage – Forms 1–4
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Chip label={`Overall Avg: ${overallAvg || 0}`} color="primary" />
                    <Tooltip title="Export CSV">
                        <IconButton onClick={exportCSV} disabled={loading}>
                            <FileDownload />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            {/* KPIs per Form */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {kpis.map((k) => (
                    <Grid key={k.form} item xs={12} sm={6} md={3}>
                        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.4, delay: 0.05 * k.form }}>
                            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                <CardHeader title={`Form ${k.form}`} sx={{ pb: 0 }} />
                                <CardContent>
                                    <Typography variant="h5" color="primary" fontWeight={700}>
                                        {k.avg || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Average points
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2}>
                {/* Entry Form */}
                <Grid item xs={12} md={4}>
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.4 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            <CardHeader title={editingId ? "Edit Grade Entry" : "Add Grade Entry"} />
                            <CardContent>
                                <Box component="form" onSubmit={handleAddOrUpdate}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="form-label">Form</InputLabel>
                                                <Select labelId="form-label" value={form} label="Form" onChange={(e) => setForm(e.target.value)} disabled={loading}>
                                                    {[1, 2, 3, 4].map((f) => (
                                                        <MenuItem key={f} value={f}>
                                                            {f}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="term-label">Term</InputLabel>
                                                <Select labelId="term-label" value={term} label="Term" onChange={(e) => setTerm(e.target.value)} disabled={loading}>
                                                    {[1, 2, 3].map((t) => (
                                                        <MenuItem key={t} value={t}>
                                                            {t}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="subject-label">Subject</InputLabel>
                                                <Select labelId="subject-label" value={subject} label="Subject" onChange={(e) => setSubject(e.target.value)} disabled={loading}>
                                                    {SUBJECTS.map((s) => (
                                                        <MenuItem key={s} value={s}>
                                                            {s}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel id="grade-label">Grade</InputLabel>
                                                <Select labelId="grade-label" value={grade} label="Grade" onChange={(e) => setGrade(e.target.value)} disabled={loading}>
                                                    {GRADES.map((g) => (
                                                        <MenuItem key={g} value={g}>
                                                            {g}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    fullWidth
                                                    disabled={loading}
                                                    startIcon={loading ? <CircularProgress size={20} /> : null}
                                                >
                                                    {editingId ? "Update" : "Add"}
                                                </Button>
                                                <Button variant="outlined" onClick={resetForm} fullWidth disabled={loading}>
                                                    Reset
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="filter-form-label">Filter by Form</InputLabel>
                                        <Select labelId="filter-form-label" value={filterForm} label="Filter by Form" onChange={(e) => setFilterForm(e.target.value)}>
                                            <MenuItem value="all">All</MenuItem>
                                            {[1, 2, 3, 4].map((f) => (
                                                <MenuItem key={f} value={String(f)}>
                                                    Form {f}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="radar-form">Radar Form</InputLabel>
                                        <Select labelId="radar-form" value={radarForm} label="Radar Form" onChange={(e) => setRadarForm(e.target.value)}>
                                            {[1, 2, 3, 4].map((f) => (
                                                <MenuItem key={f} value={f}>
                                                    {f}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="radar-term">Radar Term</InputLabel>
                                        <Select labelId="radar-term" value={radarTerm} label="Radar Term" onChange={(e) => setRadarTerm(e.target.value)}>
                                            {[1, 2, 3].map((t) => (
                                                <MenuItem key={t} value={t}>
                                                    {t}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Grid>

                {/* Charts */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.05 }}>
                                <Card sx={{ height: 400, width: 1200, borderRadius: 3, boxShadow: 3 }}>
                                    <CardHeader title="Average Points per Term " />
                                    <CardContent sx={{ height: 340 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={trendData} margin={{ top: 5, right: 16, bottom: 0, left: -10 }}>
                                                <XAxis dataKey="period" angle={-20} textAnchor="end" interval={0} height={60} />
                                                <YAxis domain={[0, 12]} tickCount={7} />
                                                <ReTooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="avg"
                                                    name="Avg Points"
                                                    stroke="#2563eb"          // Line color
                                                    strokeWidth={3}           // Line thickness
                                                    dot={{ fill: "#31234c", strokeWidth: 2, r: 6 }}  // Dot styling
                                                    activeDot={{ r: 8, fill: "#1e40af" }}            // Active dot
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12}>
                            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}>
                                <Card sx={{ height: 400, width: 1200, borderRadius: 3, boxShadow: 3 }}>
                                    <CardHeader title={`Per-Subject Averages ${filterForm === "all" ? "(All Forms)" : `(Form ${filterForm})`}`} />
                                    <CardContent sx={{ height: 350 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subjectBarData} margin={{ top: 5, right: 16, bottom: 0, left: -10 }}>
                                                <XAxis dataKey="subject" angle={-20} textAnchor="end" interval={0} height={60} />
                                                <YAxis domain={[0, 12]} />
                                                <ReTooltip />
                                                <Legend />
                                                <Bar
                                                    dataKey="avg"
                                                    name="Avg Points"
                                                    fill="#10b981"           // Bar fill color
                                                    stroke="#059669"         // Bar border color
                                                    strokeWidth={1}          // Border width
                                                    radius={[4, 4, 0, 0]}    // Rounded corners
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12}>
                            <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.15 }}>
                                <Card sx={{ height: 400, width: 1200, borderRadius: 3, boxShadow: 3 }}>
                                    <CardHeader title={`Form ${radarForm}, Term ${radarTerm}`} />
                                    <CardContent sx={{ height: 340 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart data={radarData} outerRadius="80%">
                                                <PolarGrid stroke="#e5e7eb" />  {/* Grid color */}
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151' }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 12]} tick={{ fill: '#6b7280' }} />
                                                <Radar
                                                    name="Score"
                                                    dataKey="score"
                                                    stroke="#8b5cf6"         // Line color
                                                    fill="#8b5cf6"           // Fill color
                                                    fillOpacity={0.3}        // Transparency
                                                    strokeWidth={2}          // Line thickness
                                                    dot={{ fill: "#7c3aed", strokeWidth: 2, r: 4 }}  // Dot styling
                                                />
                                                <Legend />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Data Table */}
            {/* Data Table */}
            <Box sx={{ mt: 3 }}>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardHeader
                            title={`All Entries (${filteredRows.length} total)`}
                            action={
                                <Chip
                                    label={`Showing ${paginatedRows.length} of ${filteredRows.length}`}
                                    variant="outlined"
                                    size="small"
                                />
                            }
                        />
                        <CardContent sx={{ p: 0 }}>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Form</TableCell>
                                            <TableCell>Term</TableCell>
                                            <TableCell>Subject</TableCell>
                                            <TableCell>Grade</TableCell>
                                            <TableCell align="right">Points</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                    {filteredRows.length === 0
                                                        ? "No entries yet. Add your first grade above."
                                                        : "No entries found for the current filter."
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedRows.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell>{row.form}</TableCell>
                                                    <TableCell>{row.term}</TableCell>
                                                    <TableCell>{row.subject}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.grade}
                                                            size="small"
                                                            color={GRADE_POINTS[row.grade] >= 9 ? "success" :
                                                                GRADE_POINTS[row.grade] >= 6 ? "warning" : "error"}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {GRADE_POINTS[row.grade] || 0}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                style={{ color: '#1976d2' }}
                                                                onClick={() => handleEdit(row)}
                                                                disabled={loading}
                                                                size="small"
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                style={{ color: '#d32f2f' }}
                                                                onClick={() => handleDelete(row)}
                                                                disabled={loading}
                                                                size="small"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            {filteredRows.length > 0 && (
                                <TablePagination
                                    component="div"
                                    count={filteredRows.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    labelRowsPerPage="Rows per page:"
                                    labelDisplayedRows={({ from, to, count }) =>
                                        `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                                    }
                                    sx={{
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        '& .MuiTablePagination-toolbar': {
                                            paddingLeft: 2,
                                            paddingRight: 2
                                        }
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </Box>
            <Box sx={{ mt: 3, mb: 4 }}>
                <Typography variant="caption" color="text.secondary">
                    Overview of high school grades (Forms 1–4).
                </Typography>
            </Box>

            {/* Alert Snackbar */}
            <Snackbar
                open={alert.open}
                autoHideDuration={4000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}