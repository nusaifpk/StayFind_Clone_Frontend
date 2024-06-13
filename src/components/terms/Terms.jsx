import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ScrollDialog() {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <p>
        I agree to the{' '}
        <span onClick={handleClickOpen('paper')} style={{ color: 'rgba(17, 107, 143)', fontWeight: '600', cursor: 'pointer' }}>
          terms and conditions
        </span>
      </p>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Terms and Conditions</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <p>
              Welcome to StayFind, your go-to platform for booking hotels and resorts. By using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully:
            </p>
            <p>
              <strong>1. Booking and Reservation:</strong> StayFind allows users to browse and book accommodations at various hotels and resorts listed on our platform. By making a reservation through StayFind, you enter into a direct contractual relationship with the chosen hotel or resort.
            </p>
            <p>
              <strong>2. Accuracy of Information:</strong> While we strive to provide accurate and up-to-date information on our platform, we cannot guarantee the accuracy, completeness, or reliability of any information, including but not limited to hotel descriptions, amenities, and pricing. Users are encouraged to verify all details directly with the respective hotels or resorts.
            </p>
            <p>
              <strong>3. Payment and Cancellation Policies:</strong> Payment and cancellation policies vary by hotel or resort and are subject to change. Users are responsible for reviewing and understanding the payment terms, cancellation policies, and any additional fees associated with their bookings before making a reservation.
            </p>
            <p>
              <strong>4. User Conduct:</strong> Users agree to use StayFind solely for lawful purposes and in compliance with all applicable laws and regulations. Any use of our platform for illegal or unauthorized purposes is strictly prohibited.
            </p>
            <p>
              <strong>5. Privacy:</strong> StayFind values the privacy of its users. We collect, store, and process personal information in accordance with our Privacy Policy. By using our platform, you consent to the collection, storage, and processing of your personal information as described in our Privacy Policy.
            </p>
            <p>
              <strong>6. Intellectual Property:</strong> All content, including but not limited to logos, trademarks, text, images, and software, on the StayFind platform is the property of StayFind or its licensors and is protected by copyright and other intellectual property laws. Users may not use, reproduce, or distribute any content from StayFind without prior written permission.
            </p>
            <p>
              <strong>7. Limitation of Liability:</strong> StayFind is not liable for any damages, including but not limited to direct, indirect, incidental, consequential, or punitive damages, arising out of or in connection with the use of our platform or the services provided by hotels or resorts listed on our platform.
            </p>
            <p>
              <strong>8. Indemnification:</strong> Users agree to indemnify and hold StayFind harmless from and against any and all claims, liabilities, damages, losses, costs, and expenses, including legal fees, arising out of or in connection with their use of StayFind or any breach of these terms and conditions.
            </p>
            <p>
              <strong>9. Changes to Terms and Conditions:</strong> StayFind reserves the right to modify or revise these terms and conditions at any time without prior notice. Users are responsible for reviewing the terms and conditions periodically for changes. Continued use of StayFind after any modifications indicates acceptance of the updated terms and conditions.
            </p>
            <p>
              By using StayFind, you acknowledge that you have read, understood, and agree to abide by these terms and conditions. If you do not agree with any part of these terms and conditions, please do not use StayFind.
            </p>
            <p>
              For any questions or concerns regarding these terms and conditions, please contact us at <a href="mailto:contactstayfind@gmail.com">contact@stayfind.com</a>.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>AGREE</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
