import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
  Fade,
  DialogContentText,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import { red } from '@mui/material/colors';
import axios from 'axios';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      showAlert('Error fetching customers', 'error');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpen = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/customers/${editingId}`, formData, { headers });
        showAlert('Customer updated successfully', 'success');
      } else {
        await axios.post('http://localhost:5000/api/customers', formData, { headers });
        showAlert('Customer added successfully', 'success');
      }

      handleClose();
      fetchCustomers();
    } catch (error) {
      showAlert(editingId ? 'Error updating customer' : 'Error adding customer', 'error');
    }
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setEditingId(customer._id);
    setOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/customers/${selectedCustomer._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Animate the removal
      setCustomers(prev => prev.filter(c => c._id !== selectedCustomer._id));
      showAlert('Customer deleted successfully', 'success');
    } catch (error) {
      showAlert('Error deleting customer', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Customer
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search customers..."
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer._id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  transition: 'background-color 0.2s ease',
                }}
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleEdit(customer)} 
                    color="primary"
                    sx={{ 
                      '&:hover': { 
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(customer)}
                    color="error"
                    sx={{ 
                      '&:hover': { 
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Address"
              fullWidth
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '400px',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: red[50], width: 60, height: 60, mb: 2 }}>
            <PersonRemoveIcon sx={{ color: red[500], fontSize: 32 }} />
          </Avatar>
          <DialogTitle sx={{ pb: 1 }}>Delete Customer</DialogTitle>
          <DialogContent>
            <DialogContentText align="center" sx={{ mb: 2 }}>
              Are you sure you want to delete{' '}
              <Typography component="span" fontWeight="bold" color="error">
                {selectedCustomer?.name}
              </Typography>
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ width: '100%', justifyContent: 'center', gap: 2, pb: 2 }}>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{ width: 120 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              sx={{ width: 120 }}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={alert.severity} 
          sx={{ 
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
          }}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;
