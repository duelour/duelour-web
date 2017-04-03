import { Button, FormGroup, FormControl } from 'react-bootstrap';

export default () => (
  <div>
    <form>
      <FormGroup>
        <FormControl type="text" placeholder="Username"/>
      </FormGroup>
      <FormGroup>
        <FormControl type="password" placeholder="Password"/>
      </FormGroup>
      <Button bsStyle="primary" type="submit">Submit</Button>
    </form>
    <style jsx global>{`
        form {
          text-align: center;
        }
        input {
          font-size: 20px !important;
          font-family: inherit !important;
          padding: 30px 20px !important;
          border-width: 1px !important;
        }
    `}</style>
  </div>
);
