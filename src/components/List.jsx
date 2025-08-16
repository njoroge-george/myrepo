import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, IconButton, Typography, Stack, Pagination, Tooltip
} from "@mui/material";
import { Edit, Delete, Save, OpenInNew } from "@mui/icons-material";

function normalizeDate(dateStr) {
    if (!dateStr) return "Unknown Date";
    return dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
}

function groupByDate(workouts) {
    return workouts.reduce((acc, workout) => {
        const dateKey = normalizeDate(workout.date);
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(workout);
        return acc;
    }, {});
}

export default function List({ workouts, onDelete, onUpdate, onEdit }) {
    const [editingId, setEditingId] = useState(null);
    const [editedWorkout, setEditedWorkout] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const grouped = groupByDate(workouts);
    const entries = Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));

    const datesPerPage = 7;
    const totalPages = Math.ceil(entries.length / datesPerPage);
    const paginatedEntries = entries.slice((currentPage - 1) * datesPerPage, currentPage * datesPerPage);

    const handleEdit = (workout) => {
        setEditingId(workout.id);
        setEditedWorkout({ ...workout }); // ✅ include date
    };

    const handleFieldChange = (field, value) => {
        setEditedWorkout(prev => ({
            ...prev,
            [field]: value,
            id: editingId,
        }));
    };

    const handleSave = () => {
        // ✅ Validation: check all fields are present
        if (!editedWorkout.name || !editedWorkout.type || !editedWorkout.reps || !editedWorkout.date) {
            alert('All fields (including date) are required');
            return;
        }
        onUpdate(editedWorkout);
        setEditingId(null);
    };

    return (
        <div>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                📅 Daily Workout Log
            </Typography>

            {paginatedEntries.map(([date, workouts]) => (
                <Paper key={date} sx={{ mb: 4, p: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {date}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Workout</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Reps</TableCell>
                                    <TableCell>Date</TableCell>  {/* ✅ show date */}
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workouts.map((workout) => (
                                    <TableRow key={workout.id}>
                                        {editingId === workout.id ? (
                                            <>
                                                <TableCell>
                                                    <TextField
                                                        value={editedWorkout.name || ""}
                                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={editedWorkout.type || ""}
                                                        onChange={(e) => handleFieldChange('type', e.target.value)}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={editedWorkout.reps || ""}
                                                        onChange={(e) => handleFieldChange('reps', e.target.value)}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="date"
                                                        value={normalizeDate(editedWorkout.date)}
                                                        onChange={(e) => handleFieldChange('date', e.target.value)}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Save inline edit">
                                                        <IconButton color="primary" onClick={handleSave}>
                                                            <Save />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>{workout.name}</TableCell>
                                                <TableCell>{workout.type}</TableCell>
                                                <TableCell>{workout.reps}</TableCell>
                                                <TableCell>{normalizeDate(workout.date)}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Edit inline">
                                                        <IconButton color="primary" onClick={() => handleEdit(workout)}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit in form">
                                                        <IconButton color="secondary" onClick={() => onEdit(workout)}>
                                                            <OpenInNew />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                window.confirm("Delete this workout?") && onDelete(workout.id)
                                                            }
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ))}

            {totalPages > 1 && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, val) => setCurrentPage(val)}
                        color="primary"
                    />
                </Stack>
            )}
        </div>
    );
}
