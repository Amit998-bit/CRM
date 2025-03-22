import React from 'react';
import pdf1 from "./1.pdf";
import pdf2 from "./2.pdf";
import pdf3 from "./3.pdf";
import pdf4 from "./4.pdf";


const Brochure = () => {
  const pdfs = [
    { name: 'Tariff ', url: pdf2 },
    { name: 'Tariff SMO', url: pdf4 },
    { name: 'Bussiness Portal', url: pdf1},
    { name: 'Brochure', url: pdf3 },

  ];

  return (
    <div className='mt-4'>
      {pdfs.map((pdf, index) => (
        <div key={index} style={{ marginBottom: '20px'  }}>
          <h4>{pdf.name}</h4>
          <hr />
          <embed
            src={pdf.url}
            type="application/pdf"
            width="100%"
            height="1000px"
            style={{ border: '1px solid #ccc' }}
          />
          <br />
          <a href={pdf.url} download>
            <button className='btn btn-primary'>Download {pdf.name}</button>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Brochure;
