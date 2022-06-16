import { useRef, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// component
import Iconify from "../../../components/Iconify";
import axios from "../../../http-common";

// ----------------------------------------------------------------------

export default function UserMoreMenu({ user, forceUpdate }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  console.log("REFF:", ref);
  console.log("USERRR:", user);

  return (
    <>
      <IconButton
        ref={ref}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
            onClick={() => {
              console.log("CLICKEDDDD!!!");
              try {
                axios
                  .delete(`/grupa-microservice/korisnik/${user.id}`)
                  .then((res) => {
                    console.log("RES FOR DELETE: ", res);
                    forceUpdate();
                  });
              } catch (error) {
                console.log("ERRORRRR: ", error);
              }
            }}
          />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to="#"
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
