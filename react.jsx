import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const App = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/pizzas')
      .then(response => {
        setPizzas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddPizza = (values, { setSubmitting }) => {
    axios.post('http://localhost:3001/pizzas', values)
      .then(response => {
        setPizzas([...pizzas, response.data]);
        setSubmitting(false);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUpdatePizza = (id, values, { setSubmitting }) => {
    axios.put(`http://localhost:3001/pizzas/${id}`, values)
      .then(response => {
        setPizzas(pizzas.map(pizza => pizza.id === id ? response.data : pizza));
        setSubmitting(false);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeletePizza = (id) => {
    axios.delete(`http://localhost:3001/pizzas/${id}`)
      .then(() => {
        setPizzas(pizzas.filter(pizza => pizza.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <BrowserRouter>
      <div className="container mt-5">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">Pizza Store</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/pizzas" className="nav-link">Pizzas</Link>
              </li>
              <li className="nav-item">
                <Link to="/add-pizza" className="nav-link">Add Pizza</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/pizzas" render={() => <Pizzas pizzas={pizzas} loading={loading} handleDeletePizza={handleDeletePizza} />} />
          <Route path="/add-pizza" render={() => <AddPizza handleAddPizza={handleAddPizza} />} />
          <Route path="/update-pizza/:id" render={(props) => <UpdatePizza {...props} handleUpdatePizza={handleUpdatePizza} />} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

const Home = () => {
  return (
    <div className="text-center">
      <h1>Welcome to Pizza Store</h1>
    </div>
  );
};

const About = () => {
  return (
    <div className="text-center">
      <h1>About Pizza Store</h1>
    </div>
  );
};

const Pizzas = ({ pizzas, loading, handleDeletePizza }) => {
  if (loading) {
    return (
      <div className="text-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="row">
      {pizzas.map(pizza => (
        <div key={pizza.id} className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{pizza.name}</h5>
              <p className="card-text">{pizza.description}</p>
              <p className="card-text">${pizza.price}</p>
              <button className="btn btn-danger" onClick={() => handleDeletePizza(pizza.id)}>Delete</button>
              <Link to={`/update-pizza/${pizza.id}`} className="btn btn-primary">Update</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddPizza = ({ handleAddPizza }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required(),
    price: Yup.number().required(),
  });

  return (
    <div className="text-center">
      <h1>Add Pizza</h1>
      <Formik
        initialValues={{
          name: '',
          description: '',
          price: '',
        }}
        validationSchema={schema}
        onSubmit={handleAddPizza}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <Field type="text" id="name" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <Field type="text" id="description" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <Field type="number" id="price" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Pizza</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const UpdatePizza = ({ match, handleUpdatePizza }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required(),
    price: Yup.number().required(),
  });

  const id = match.params.id;

  const [pizza, setPizza] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/pizzas/${id}`)
      .then(response => {
        setPizza(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="text-center">
      <h1>Update Pizza</h1>
      <Formik
        initialValues={{
          name: pizza.name,
          description: pizza.description,
          price: pizza.price,
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => handleUpdatePizza(id, values, { setSubmitting })}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <Field type="text" id="name" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <Field type="text" id="description" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <Field type="number" id="price" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update Pizza</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="text-center">
      <h1>Contact Us</h1>
    </div>
  );
};

export default App;