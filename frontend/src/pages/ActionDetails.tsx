import { Col, Container, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";

export function ActionDetails() {
    return (
        <div>
        <SolidarianNavbar />
        <Container className="mt-4">
            <Row>
            <Col md={12}>
                <h1>Detalles de la Acción</h1>
                {/* Aquí puedes agregar más detalles sobre la acción */}
            </Col>
            </Row>
        </Container>
        </div>
    );
    }