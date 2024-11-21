import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

function ConfirmDeactivateModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
     <DialogTitle>
  <WarningIcon sx={{ color: "#ff6f61", mr: 1 }} />
  Desactivar cuenta
</DialogTitle>
<DialogContent>
  <Typography>
    ¿Estás seguro de que deseas desactivar esta cuenta? El usuario no será eliminado del sistema, pero será desactivado y ya no aparecerá en las tablas. Esta acción no se puede deshacer.
  </Typography>
</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            textTransform: "none",
          }}
        >
          Deactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeactivateModal;
