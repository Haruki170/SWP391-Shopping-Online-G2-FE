import { Button } from '@mui/material'
import React from 'react'
import { Modal } from 'react-bootstrap'
import './order.scss'
const VoucherModal = () => {
  return (
    <Modal dialogClassName='voucher-modal' show={false} >
        <Modal.Header closeButton>
          <Modal.Title>Khuyến mại của cửa hàng </Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" >
            Hủy
          </Button>
          <Button variant="primary" >
            Chọn 
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default VoucherModal