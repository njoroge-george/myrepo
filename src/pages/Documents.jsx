import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    Grid,
} from "@mui/material";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} from "../api/documentAPI.jsx";

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editId, setEditId] = useState(null); // track which doc is being edited

    // Load docs on mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await getDocuments();
            if (res.success) {
                setDocuments(res.data);
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
        }
    };

    const handleCreateOrUpdate = async () => {
        if (!title || !content) return;
        try {
            if (editId) {
                // update mode
                const res = await updateDocument(editId, { title, content });
                if (res.success) {
                    resetForm();
                    fetchDocuments();
                }
            } else {
                // create mode
                const res = await createDocument({ title, content });
                if (res.success) {
                    resetForm();
                    fetchDocuments();
                }
            }
        } catch (err) {
            console.error("Error saving document:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteDocument(id);
            if (res.success) {
                fetchDocuments();
            }
        } catch (err) {
            console.error("Error deleting document:", err);
        }
    };

    const handleEdit = (doc) => {
        setEditId(doc.id);
        setTitle(doc.title);
        setContent(doc.content);
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setEditId(null);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    color: "#1976d2",
                    textAlign: "center",
                    mb: 3,
                }}
            >
                📚 Documents Manager
            </Typography>

            {/* Form to create/update document */}
            <Card
                sx={{
                    mb: 4,
                    p: 2,
                    boxShadow: 4,
                    background: editId ? "#fff3e0" : "#e3f2fd",
                }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: "#d32f2f" }}>
                        {editId ? "✏️ Edit Document" : "➕ Add New Document"}
                    </Typography>
                    <TextField
                        label="Title"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Content"
                        fullWidth
                        multiline
                        rows={6}
                        sx={{ mb: 2 }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color={editId ? "warning" : "primary"}
                        onClick={handleCreateOrUpdate}
                        sx={{ mr: 2 }}
                    >
                        {editId ? "Update Document" : "Save Document"}
                    </Button>
                    {editId && (
                        <Button variant="outlined" color="secondary" onClick={resetForm}>
                            Cancel
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* List of documents */}
            <Grid container spacing={2}>
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <Grid item xs={12} key={doc.id}>
                            <Card
                                sx={{
                                    boxShadow: 3,
                                    borderLeft: "6px solid #1976d2",
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: 6, transform: "scale(1.01)" },
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: "bold", color: "#1565c0" }}
                                    >
                                        {doc.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ whiteSpace: "pre-line", color: "#424242" }}
                                    >
                                        {doc.content.length > 200
                                            ? `${doc.content.slice(0, 200)}...`
                                            : doc.content}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        color="primary"
                                        onClick={() => handleEdit(doc)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleDelete(doc.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No documents found.</Typography>
                )}
            </Grid>
        </Container>
    );
};

export default Documents;
