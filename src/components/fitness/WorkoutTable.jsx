import React from "react";
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TablePagination,
    Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function WorkoutTable({
                                         workouts,
                                         page,
                                         rowsPerPage,
                                         handleChangePage,
                                         handleChangeRowsPerPage,
                                         handleEdit,
                                         handleDelete,
                                     }) {
    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Workout History
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Type</b></TableCell>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Reps</b></TableCell>
                                <TableCell><b>Duration</b></TableCell>
                                <TableCell><b>Calories</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w) => (
                                <TableRow key={w.id}>
                                    <TableCell>{w.workout_date?.slice(0, 10)}</TableCell>
                                    <TableCell>{w.workout_type}</TableCell>
                                    <TableCell>{w.name}</TableCell>
                                    <TableCell>{w.reps}</TableCell>
                                    <TableCell>{w.duration} min</TableCell>
                                    <TableCell>{w.calories} cal</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(w)} color="primary"><Edit /></IconButton>
                                        <IconButton onClick={() => handleDelete(w.id)} color="error"><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={workouts.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </Card>
    );
}
