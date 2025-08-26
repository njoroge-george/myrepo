import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Stack, CircularProgress, Box, Rating } from "@mui/material";
import { getRecipes } from "../api/recipeAPI.jsx";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import StarIcon from "@mui/icons-material/Star";
import TagIcon from "@mui/icons-material/Tag";

export default function RecipesCard({ cardStyle }) {
    const [stats, setStats] = useState({
        total: 0,
        avgRating: 0,
        favTitle: '',
        tags: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const res = await getRecipes();
                const recipes = Array.isArray(res) ? res : res?.data || [];
                const total = recipes.length;
                const avgRating = total
                    ? (recipes.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / total).toFixed(2)
                    : 0;
                // Favorite: highest rating, or most recent if tie
                let favTitle = '';
                if (recipes.length) {
                    const sorted = [...recipes].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    favTitle = sorted[0]?.title || '';
                }
                // Collect all tags (unique)
                const tags = Array.from(
                    new Set(recipes.flatMap(r => Array.isArray(r.tags) ? r.tags : []))
                );
                setStats({
                    total,
                    avgRating,
                    favTitle,
                    tags,
                });
            } catch {
                setStats({ total: 0, avgRating: 0, favTitle: '', tags: [] });
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <Card sx={cardStyle}>
            <CardContent>
                <Typography variant="h6" mb={1}>Recipe Overview</Typography>
                {loading ? (
                    <CircularProgress color="primary" size={28} />
                ) : (
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <LocalDiningIcon color="primary" />
                            <Typography variant="body2">Total Recipes</Typography>
                            <Chip label={stats.total} color="primary" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <StarIcon color="warning" />
                            <Typography variant="body2">Average Rating</Typography>
                            <Rating value={Number(stats.avgRating)} precision={0.1} readOnly size="small" />
                            <Chip label={stats.avgRating} color="warning" />
                        </Stack>
                        {stats.favTitle && (
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                <StarIcon color="success" />
                                <Typography variant="body2">Top Recipe</Typography>
                                <Chip label={stats.favTitle} color="success" />
                            </Stack>
                        )}
                        {stats.tags.length > 0 && (
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                <TagIcon color="secondary" />
                                <Typography variant="body2">Tags</Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                    {stats.tags.map(tag => (
                                        <Chip key={tag} label={tag} color="secondary" size="small" />
                                    ))}
                                </Box>
                            </Stack>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}