import React from 'react'
import PropTypes from 'prop-types'

const preventClose = event => event.stopPropagation();

const Popup = ({ children, isOpen, onClose }) => {

  return (
    <div
      style={isOpen ? styles.modalShow : styles.modalHide}
      onClick={onClose}>
      <div
        style={styles.content}
        onClick={preventClose}>
        <div
          style={styles.close}
          onClick={onClose}>
          <span>&#10005;</span>
        </div>
        {children}
      </div>
    </div>
  )
};

Popup.propTypes = {
  // isOpen: PropTypes.oneOf([null, PropTypes.object]),
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
}

export default Popup;

const styles = {
  modalShow: {
    position: 'fixed',
    zIndex: 1,
    display: 'flex',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.86)',
  },
  modalHide: {
    display: 'none',
  },
  content: {
    margin: 'auto',
    width: '95%',
    maxWidth: '600px',
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: '15px',
    color: 'white',
  }
}