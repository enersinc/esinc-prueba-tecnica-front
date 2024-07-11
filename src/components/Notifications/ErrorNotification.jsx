import { Modal } from "antd";
import React, { useEffect, useState } from "react";

export default function ErrorNotification({
  message,
  errorNotification,
  setShowError,
}) {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    setShowError(false);
  };

  useEffect(() => {
    if (errorNotification) {
      setOpen(true);
    }
  }, [errorNotification]);

  return (
    <Modal
      open={open}
      title={message}
      destroyOnClose
      onCancel={onClose}
      footer={""}
    ></Modal>
  );
}
