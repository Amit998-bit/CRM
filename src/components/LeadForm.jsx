import React, { useState, useEffect } from 'react';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    personname: '',
    email: '',
    contact: '',
    address: '',
    description: '',
    progress: '',
    date: '',
    comment: '',
    payment: '',
    balPayment: '',
    clientstatus: '',
    services: [{ name: '', buydate: '', expirydate: '' }],
    lastdate: '',
    designation: '',
    ownername: '',
    ownerno: '',
    owneremail: '',
    domain: '',
    domainpurchaseby: '',
    domaindate: '',
    domainrenew: '',
    domainid: '',
    domainpass: '',
    domainurl: '',
    assignedTo: '',
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users to populate the "Assigned To" dropdown
    fetch('https://crm.hxbindia.com/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...formData.services];
    newServices[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      services: newServices,
    }));
  };

  const addService = () => {
    setFormData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { name: '', buydate: '', expirydate: '' }],
    }));
  };

  const removeService = (index) => {
    setFormData((prevData) => {
      const newServices = [...prevData.services];
      newServices.splice(index, 1);
      return {
        ...prevData,
        services: newServices,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://crm.hxbindia.com/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(result => {
        alert('Lead created successfully!');
        setFormData({
          name: '',
          personname: '',
          email: '',
          contact: '',
          address: '',
          description: '',
          progress: '',
          date: '',
          comment: '',
          payment: '',
          balPayment: '',
          clientstatus: '',
          services: [{ name: '', buydate: '', expirydate: '' }],
          lastdate: '',
          designation: '',
          ownername: '',
          ownerno: '',
          owneremail: '',
          domain: '',
          domainpurchaseby: '',
          domaindate: '',
          domainrenew: '',
          domainid: '',
          domainpass: '',
          domainurl: '',
          assignedTo: '',
        });
      })
      .catch(error => console.error('Error creating lead:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name"     className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="personname">Person Name:</label>
        <input type="text" id="personname"     className="form-control" name="personname" value={formData.personname} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email"     className="form-control" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="contact">Contact:</label>
        <input type="text" id="contact"     className="form-control" name="contact" value={formData.contact} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address:</label>
        <input type="text" id="address"     className="form-control" name="address" value={formData.address} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description"     className="form-control" name="description" value={formData.description} onChange={handleChange}></textarea>
      </div>
      <div className="col-md-6">
                <label htmlFor="">Status</label>
                <select
                  className="form-control"
                  value={formData.progress} onChange={handleChange} 
                  required
                >
                  <option value="Select Status">Select Status</option>
                  <option value="callback">Call Back</option>
                  <option value="dmufc">DMUFC</option>
                  <option value="dmufwp">DMUFWP</option>
                  <option value="pg">PG</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
      {/* <div className="form-group">
        <label htmlFor="progress">Progress:</label>
        <input type="text" id="progress" name="progress" value={formData.progress} onChange={handleChange} />
      </div> */}
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input type="date"     className="form-control" id="date" name="date" value={formData.date} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="comment">Comment:</label>
        <textarea id="comment"      className="form-control" name="comment" value={formData.comment} onChange={handleChange}></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="payment">Payment:</label>
        <input type="text" id="payment"     className="form-control" name="payment" value={formData.payment} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="balPayment">Balance Payment:</label>
        <input type="text" id="balPayment"     className="form-control" name="balPayment" value={formData.balPayment} onChange={handleChange} />
      </div>
      <div className="col-md-6">
                <label htmlFor="">Lead Status</label>
                <select
                  className="form-control"
                  value={formData.clientstatus} onChange={handleChange}
                >
                  <option value="Select option">Select option</option>
                  <option value="nc">NC</option>
                  <option value="dc">DC</option>
                  <option value="ec">EC</option>
                </select>
              </div>
      {/* <div className="form-group">
        <label htmlFor="clientstatus">Client Status:</label>
        <input type="text" id="clientstatus" name="clientstatus" value={formData.clientstatus} onChange={handleChange} />
      </div> */}
      <div className="form-group">
        <label htmlFor="services">Services:</label>
        {formData.services.map((service, index) => (
          <div key={index} className="service-group">
            <input
              type="text"
              name="name"     className="form-control"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) => handleServiceChange(index, e)}
              required
            />
            <input
              type="date"     className="form-control"
              name="buydate"
              placeholder="Buy Date"
              value={service.buydate}
              onChange={(e) => handleServiceChange(index, e)}
              required
            />
            <input
              type="date"     className="form-control"
              name="expirydate"
              placeholder="Expiry Date"
              value={service.expirydate}
              onChange={(e) => handleServiceChange(index, e)}
              required
            />
            <button type="button" onClick={() => removeService(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addService}>Add Service</button>
      </div>
      <div className="form-group">
        <label htmlFor="lastdate">Last Date:</label>
        <input type="date"     className="form-control" id="lastdate" name="lastdate" value={formData.lastdate} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="designation">Designation:</label>
        <input type="text"     className="form-control" id="designation" name="designation" value={formData.designation} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="ownername">Owner Name:</label>
        <input type="text"     className="form-control" id="ownername" name="ownername" value={formData.ownername} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="ownerno">Owner Contact:</label>
        <input type="text"     className="form-control" id="ownerno" name="ownerno" value={formData.ownerno} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="owneremail">Owner Email:</label>
        <input type="email"      className="form-control" id="owneremail" name="owneremail" value={formData.owneremail} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domain">Domain:</label>
        <input type="text"     className="form-control" id="domain" name="domain" value={formData.domain} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domainpurchaseby">Domain Purchased By:</label>
        <input type="text"     className="form-control" id="domainpurchaseby" name="domainpurchaseby" value={formData.domainpurchaseby} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domaindate">Domain Date:</label>
        <input type="date"     className="form-control" id="domaindate" name="domaindate" value={formData.domaindate} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domainrenew">Domain Renewal:</label>
        <input type="date"     className="form-control" id="domainrenew" name="domainrenew" value={formData.domainrenew} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domainid">Domain ID:</label>
        <input type="text"     className="form-control" id="domainid" name="domainid" value={formData.domainid} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domainpass">Domain Password:</label>
        <input type="password"     className="form-control" id="domainpass" name="domainpass" value={formData.domainpass} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="domainurl">Domain URL:</label>
        <input type="url"     className="form-control" id="domainurl" name="domainurl" value={formData.domainurl} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="assignedTo">Assigned To:</label>
        <select id="assignedTo"     className="form-control" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default LeadForm;
