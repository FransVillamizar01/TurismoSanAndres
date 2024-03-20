import { Link } from "react-router-dom";

export default function Route() {
    return <>
        <h2 style={{ fontSize: 160 }}>Home</h2>
        <Link to="/about">
            Sobre nosotros
        </Link>
        <br/>
        <Link to="/contact">
            Contactanos
        </Link>
    </>
}