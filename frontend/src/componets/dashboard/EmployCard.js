
import * as Icons from "@mui/icons-material";
import Card  from 'react-bootstrap/Card';
import StarBorder from '@mui/icons-material/StarBorder';

function EmployCard(data ) {
  return (

    <div className="col-sm-3 ">
      <Card >

        <div className="employ-detail-panel">
          <div className="employ-img">
            <Card.Img variant="top" src={data.img}  />
          </div>
          <Card.Body>
            <Card.Title> {data.name} </Card.Title>
            <Card.Text>{data.designation}</Card.Text>
            
          </Card.Body>
        </div>
      </Card>
  </div>
      
  );
}
export default EmployCard;

