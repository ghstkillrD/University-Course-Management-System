import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { School, Assignment, Grade, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'STUDENT':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Student Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Welcome back, {user.name}!
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">5</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enrolled Courses
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Grade color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">3.7</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current GPA
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assignment color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">15</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Credits
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" startIcon={<School />}>
                    Browse Courses
                  </Button>
                  <Button variant="outlined" startIcon={<Assignment />}>
                    View Schedule
                  </Button>
                  <Button variant="outlined" startIcon={<Grade />}>
                    Check Grades
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );      case 'PROFESSOR':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Professor Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Welcome back, Prof. {user.name}!
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">3</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Teaching Courses
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Person color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">85</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Students
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );      case 'ADMIN':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Administrator Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                System Overview
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Person color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">1,250</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Students
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <School color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">45</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Courses
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );      default:
        return (
          <Typography variant="h5">
            Welcome to the University Course Management System
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {getDashboardContent()}
    </Box>
  );
};

export default DashboardPage;