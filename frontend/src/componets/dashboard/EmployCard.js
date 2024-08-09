
import * as Icons from "@mui/icons-material";
import Card  from 'react-bootstrap/Card';
import StarBorder from '@mui/icons-material/StarBorder';

function EmployCard(user) {
  const baseUrl = 'http://192.168.1.134:3000/public/image/';
  const imageUrl = baseUrl + user.img; // Combine base URL with user's image path
  return (
    <div className="col-sm-3">
    <Card className="hover-flip-card">
      <div className="employ-detail-panel">
        <div className="employ-img">
          <Card.Img variant="top" src={imageUrl} />
        </div>
        <Card.Body className="card-body">
          <Card.Title>{user.name}</Card.Title>
          <Card.Text>{user.designation}</Card.Text>
          <Card.Text>{user.mobile}</Card.Text>
        </Card.Body>
      </div>
    </Card>
  </div>
      
  );
}
export default EmployCard;

