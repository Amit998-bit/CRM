// src/HRPolicy.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HRPolicy = () => {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Office Policies</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Office Timings</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Morning intime: 09:30 AM (Grace period: 15 mins)</li>
            <li className="list-group-item">Evening outtime: 06:30 PM</li>
          </ul>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Late Marks</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Late mark counted at: 09:46 AM</li>
            <li className="list-group-item">Maximum allowed late marks per month: 4</li>
            <li className="list-group-item">Deductions:</li>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Up to 4 late marks: No deduction</li>
              <li className="list-group-item">After 4 late marks: 0.5 day salary deduction per extra late mark</li>
            </ul>
          </ul>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Short Working</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Morning: After 10:30 AM counts as half day</li>
            <li className="list-group-item">Evening: Before 05:00 PM counts as half day</li>
          </ul>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Breaks</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Lunch time: 01:30 PM to 02:00 PM</li>
            <li className="list-group-item">Tea break: 04:00 PM to 04:15 PM</li>
          </ul>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Evening Reporting</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Sales Team: Report daily to the reporting manager in the evening.</li>
            <li className="list-group-item">Backend Team: Report daily task list before leaving the office.</li>
          </ul>
        </div>
      </div>

     
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Confirmation of Services</h5>
          <p className="card-text">
          Confirmation criteria : Employees in sales and backend will get their confirmation of service after completion of 6 months in job, subject to meet basic criteria of your role and responsibility. <br />
          
          <b>
          Confirmation benefits :
          </b>
          <br />
          After confirmation you will be entitle to get leaves as follows - <br />
          6 Casual Leaves : You will get 6 casual leaves in a year. At one go one leave can be taken. <br />
          7 Medical Leaves  : You will get 7 medical leaves in a year. At one go one leave can be taken. If more than one leave then medical certificate compulsory.  <br />
          15 Earned Leaves : You will get 15 earned leaves in a year. At one go maximum 3-4 leaves an be taken. Note if anyone takes leave in continuation of one day prior and one day after of "office leave day" then office leave day will also be consider as employee leave. <br />
          After year end all remaining earned leaves will be paid to employee through Leave Encashment. <br />
          <b>
          Leave Encashment :
          </b>
          <br />
          After year end employee will get their remaining leave's salary through leave encashment. At the time of this entitlement employee must be part of Highxbrand India Pvt. Ltd.  <br />
          Notice period : In case of leaving the job, one month prior notice given is must through official mail with higher authorities approval. At the time of leaving one has to clear all his pendings in a good acceptable manner.  <br />

          
          
           </p>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">Note</h5>
          <p className="card-text">
            The above policies are made and applicable for the betterment of the company and its employees. The company reserves the right to change or modify the policies, rules, and regulations from time to time for the betterment of all.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HRPolicy;
