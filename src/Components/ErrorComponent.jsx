import { Typography } from "@mui/material";

export default function ErrorComponent() {
    return(
        <div className="error-container">
            <Typography variant="h4" gutterBottom >We are working really hard!!!</Typography>
             
            <Typography variant="h6" gutterBottom>Requested resource is not Available</Typography>
        </div>
    )
}