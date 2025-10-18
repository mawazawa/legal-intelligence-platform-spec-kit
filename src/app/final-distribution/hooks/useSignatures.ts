import { useState } from 'react';

export type SignatureType = 'resp' | 'pet';

export const useSignatures = () => {
  const [respSigImage, setRespSigImage] = useState<string | null>(null);
  const [petSigImage, setPetSigImage] = useState<string | null>(null);
  const [respTypedName, setRespTypedName] = useState('');
  const [petTypedName, setPetTypedName] = useState('');
  const [respSignedAt, setRespSignedAt] = useState<string | null>(null);
  const [petSignedAt, setPetSignedAt] = useState<string | null>(null);

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, type: SignatureType) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'resp') {
          setRespSigImage(event.target?.result as string);
        } else {
          setPetSigImage(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>, type: SignatureType) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'resp') {
          setRespSigImage(event.target?.result as string);
        } else {
          setPetSigImage(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const signTyped = (type: SignatureType) => {
    if (type === 'resp') {
      setRespSignedAt(new Date().toISOString());
    } else {
      setPetSignedAt(new Date().toISOString());
    }
  };

  const clearSignature = (type: SignatureType) => {
    if (type === 'resp') {
      setRespSigImage(null);
      setRespTypedName('');
      setRespSignedAt(null);
    } else {
      setPetSigImage(null);
      setPetTypedName('');
      setPetSignedAt(null);
    }
  };

  return {
    respSigImage,
    petSigImage,
    respTypedName,
    petTypedName,
    respSignedAt,
    petSignedAt,
    setRespTypedName,
    setPetTypedName,
    preventDefaults,
    handleDrop,
    handlePick,
    signTyped,
    clearSignature
  };
};
