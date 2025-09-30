import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright(props : any) {
    return(
        <Typography
        variant="body2"
        align="center"
        {...props}
        sx={[
            {
                color : 'text.secondary',
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx] )
        ]}
        >
            {'Copyright @ '}
            <Link color="inherit"  to="https://tidyhomz.com">Sitemark</Link> {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}