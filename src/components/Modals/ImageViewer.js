import React from 'react'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function ImageViewer({ modal, showModal, qrCode }) {

  let subtitle;

  function openModal() {
    showModal(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    showModal(false);
  }


  return (
    <Modal
        isOpen={modal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Image viewer"
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <img src={qrCode} style={{ height: '250px', width: '250px' }} />
        </div>
      </Modal>
  )
}
