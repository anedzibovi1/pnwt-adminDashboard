import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useForceUpdate from "use-force-update";
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
  List,
} from "@mui/material";
import { blue } from "@mui/material/colors";

import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import SearchNotFound from "../components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../sections/@dashboard/user";
// mock
import USERLIST from "../_mock/user";
import axios from "../http-common";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },

  { id: "" },
];

// ----------------------------------------------------------------------

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function SimpleDialog({ open, selectedValue, onClose, emails }) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add user to group</DialogTitle>
      <List sx={{ pt: 0 }}>
        {emails?.map((email) => (
          <ListItem
            button
            onClick={() => handleListItemClick(email)}
            key={email}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={email} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function User() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [grupe, setGrupe] = useState();
  const [korisnici, setKorisnici] = useState();
  const [korisniciEmail, setKorisniciEmail] = useState();

  const forceUpdate = useForceUpdate();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [grupaFound, setGrupaFound] = useState(false);

  const [selectedValue, setSelectedValue] = useState();

  const handleClickOpen = (event) => {
    console.log("KORISNICI: ", korisnici, korisniciEmail, event.target.value);

    const grupeForAdding = grupe?.find((grupa) => {
      console.log("GROUP FOUND NAZIV:", grupa.naziv, event.target.value);
      return grupa.naziv === event.target.value || grupa.naziv === "GRUPA 1";
    });

    console.log("GROUP FOUND: ", grupeForAdding);
    setGrupaFound(grupeForAdding);
    setOpen(true);
  };

  const handleClose = async (value) => {
    setOpen(false);
    setSelectedValue(value);

    console.log("GROUP F EMAILLL: ", value, grupaFound.id);

    try {
      const response = axios.put(
        `grupa-microservice/grupa/${grupaFound.id}/korisnik`,
        {
          email: value,
        }
      );

      console.log("RESSSS: ", response);

      window.location.reload();
    } catch (error) {
      console.log("EERROORRRR:", error);
    }
  };

  useEffect(async () => {
    if (localStorage.getItem("token") === null) {
      navigate("404", { replace: true });
    }

    axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("token");
    axios.defaults.headers.common["Content-Type"] = "text/plain";

    const groups = await axios.get("grupa-microservice/grupa", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const users = await axios.get("korisnik-microservice/korisnik", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    setGrupe(groups.data.data.grupe);
    setKorisnici(users.data.data.korisnici);
    setKorisniciEmail(
      users.data.data.korisnici.map((korisnik) => korisnik.email)
    );
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const clickedDelete = (event) => {
    console.log("CLICKED RIGHT NOW");
    window.location.reload();
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;
  return (
    <Page title="Groups">
      <Container>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          emails={korisniciEmail}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Groups
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Group
          </Button>
        </Stack>
        {console.log("GROUPPSSS: ", grupe)}

        {!!grupe &&
          grupe.map((grupa) => (
            <Card style={{ marginBottom: 40 }}>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                groupName={grupa.naziv}
                onAddUserClick={handleClickOpen}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={grupa.korisnici.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {grupa.korisnici
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const { id, firstName, lastName, email } = row;
                          const isItemSelected =
                            selected.indexOf(lastName) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) =>
                                    handleClick(event, lastName)
                                  }
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    noWrap
                                    style={{ marginLeft: 12 }}
                                  >
                                    {firstName + " " + lastName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>

                              <TableCell align="right">
                                <UserMoreMenu
                                  user={row}
                                  forceUpdate={clickedDelete}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={grupa.korisnici.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          ))}
      </Container>
    </Page>
  );
}
