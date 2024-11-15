import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import InsertPhoto from '@mui/icons-material/InsertPhoto';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import RecentActorsIcon from '@mui/icons-material/RecentActors';

function FileUpload({ onDropPhoto, onDropAddressProof, onDropIdCard, photoPreview, photoMessage, addressProofMessage, idCardMessage }) {
  const { getRootProps: getRootPhotoProps, getInputProps: getInputPhotoProps } = useDropzone({
    onDrop: onDropPhoto,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'image/gif': ['.gif'] },
    maxSize: 10485760,
  });

  const { getRootProps: getRootAddressProofProps, getInputProps: getInputAddressProofProps } = useDropzone({
    onDrop: onDropAddressProof,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10485760,
  });

  const { getRootProps: getRootIdCardProps, getInputProps: getInputIdCardProps } = useDropzone({
    onDrop: onDropIdCard,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10485760,
  });

  return (
    <Box>
      {/* Subida de foto */}
      <Box {...getRootPhotoProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
        <input {...getInputPhotoProps()} />
        {photoPreview ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={photoPreview} alt="Vista previa" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <Typography variant="body1" color="primary" sx={{ mt: 2 }}>Haz clic o arrastra para cambiar la foto</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <InsertPhoto sx={{ fontSize: 80, color: '#ccc' }} />
            <Typography variant="body1" color="primary">Sube una imagen o arrástrala aquí</Typography>
            <Typography variant="caption" color="textSecondary">PNG, JPG, GIF hasta 10MB</Typography>
          </Box>
        )}
        {photoMessage && <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>{photoMessage}</Typography>}
      </Box>

      {/* Subida de comprobante de domicilio */}
      <Box {...getRootAddressProofProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
        <input {...getInputAddressProofProps()} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FolderCopyIcon sx={{ fontSize: 80, color: '#ccc' }} />
          <Typography variant="body1" color="primary">Sube un PDF o arrástralo aquí (Comprobante de Domicilio)</Typography>
          <Typography variant="caption" color="textSecondary">PDF hasta 10MB</Typography>
        </Box>
        {addressProofMessage && <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>{addressProofMessage}</Typography>}
      </Box>

      {/* Subida de identificación */}
      <Box {...getRootIdCardProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
        <input {...getInputIdCardProps()} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <RecentActorsIcon sx={{ fontSize: 80, color: '#ccc' }} />
          <Typography variant="body1" color="primary">Sube un PDF o arrástralo aquí (Identificación)</Typography>
          <Typography variant="caption" color="textSecondary">PDF hasta 10MB</Typography>
        </Box>
        {idCardMessage && <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>{idCardMessage}</Typography>}
      </Box>
    </Box>
  );
}

export default FileUpload;
