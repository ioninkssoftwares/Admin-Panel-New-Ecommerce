import React, { useState, useEffect } from "react";
import axios from "axios";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { visuallyHidden } from "@mui/utils";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

const headCells = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "customerSince", label: "Customer Since" },
  { id: "actions", label: "Actions" },
];

function EnhancedTable({ rows }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // State for confirmation dialog
  const [openEdit, setOpenEdit] = useState(false); // State for edit popup
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [isStaff, setIsStaff] = useState(false); // State for staff toggle

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.users && response.data.users.length > 0) {
        // Filter users by role "user"
        const filteredUsers = response.data.users.filter(
          (user) => user.role === "user"
        );
        setUsers(filteredUsers);
      } else {
        setUsers([]);
        toast.info("No users found");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = (userId) => {
    // Open confirmation dialog
    setConfirmDelete(userId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/user/${confirmDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      // Close confirmation dialog
      setConfirmDelete(null);
    }
  };

  const handleSortDirection = (property) => {
    return orderBy === property ? order : "asc";
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsStaff(user.isStaff);
    setOpenEdit(true);
  };
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    handleEditSubmit();
  };

  const handleFormSubmit = () => {
    setConfirmOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/customers/${selectedUser._id}`,
        { isStaff },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("User updated successfully");
        fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setOpenEdit(false);
    }
  };

  const handleEditCancel = () => {
    setOpenEdit(false);
  };

  const handleStaffToggle = () => {
    setIsStaff(!isStaff);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(searchTerm);
    const emailMatch =
      user.email && user.email.toLowerCase().includes(searchTerm);
    const mobileMatch =
      user.mobileNo && user.mobileNo.toLowerCase().includes(searchTerm);

    return nameMatch || emailMatch || mobileMatch;
  });

  const sortedUsers = stableSort(filteredUsers, getComparator(order, orderBy));

  return (
    <>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 2,
            justifyContent: "space-around",
          }}
        >
          <Typography variant="h6" component="div" sx={{ marginRight: 1 }}>
            Users
          </Typography>
          <TextField
            label="Search by Name, Email, or Phone"
            variant="outlined"
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align="left"
                        padding="normal"
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={handleSortDirection(headCell.id)}
                          onClick={() => handleRequestSort(headCell.id)}
                        >
                          {headCell.label}
                          {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                              {order === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const isItemSelected = isSelected(row._id);
                      const labelId = `enhanced-table-checkbox-${row._id}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="normal"
                          >
                            {row.name.charAt
                              ? row.name.charAt(0).toUpperCase() +
                                row.name.slice(1)
                              : "Not mentioned"}
                          </TableCell>
                          <TableCell>{row.email || "Not mentioned"}</TableCell>
                          <TableCell>
                            {row.mobileNo || "Not mentioned"}
                          </TableCell>
                          <TableCell>
                            {row.createdAt
                              ? new Date(row.createdAt).toLocaleDateString()
                              : "Not mentioned"}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="secondary"
                              onClick={() => handleDelete(row._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(row)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
        <ToastContainer />

        {/* Confirmation Dialog */}
        {confirmDelete && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="delete-confirmation-buttons">
                <button onClick={handleDeleteConfirmed}>Delete</button>
                <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Popup */}
        {selectedUser && (
          <Modal
            open={openEdit}
            onClose={handleEditCancel}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-title" variant="h6" component="h2">
                Edit User
              </Typography>
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Typography variant="h6" component="h3">
                  Details
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Name
                      </TableCell>
                      <TableCell>{selectedUser.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Email
                      </TableCell>
                      <TableCell>{selectedUser.email || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Phone
                      </TableCell>
                      <TableCell>{selectedUser.mobileNo || "N/A"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Customer Since
                      </TableCell>
                      <TableCell>
                        {selectedUser.createdAt
                          ? new Date(
                              selectedUser.createdAt
                            ).toLocaleDateString()
                          : "Not mentioned"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="body1">Make Staff</Typography>
                  <Switch
                    checked={isStaff}
                    onChange={handleStaffToggle}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 3,
                }}
              >
                <Button onClick={handleEditCancel} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleFormSubmit}>
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </Paper>

      {confirmOpen && (
        <div className="delete-confirmation-modal">
          <div className="modal-content">
            <h2>Confirm Change</h2>
            <p> Are you sure you want to make this change in user?</p>
            <div className="delete-confirmation-buttons">
              <button onClick={handleConfirmSubmit}>Confirm</button>

              <button onClick={() => handleConfirmClose()}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default EnhancedTable;
