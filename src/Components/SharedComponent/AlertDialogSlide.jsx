import { forwardRef, useState } from "react"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {

    const [open,setOpen] = useState(false)
    const handleOpen = ()=> {
        setOpen(true);
    }

    const handleClose= ()=>{
        setOpen(false)
    }
    return(
        <>
            <Dialog
                open={open}
                slots={{
                    transition: Transition
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                 <DialogTitle>{"Logout"}</DialogTitle>
                 <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                     {sessionStorage.getItem('logout')}
                </DialogContentText>
                </DialogContent>
            </Dialog>
        </> 
    )
}