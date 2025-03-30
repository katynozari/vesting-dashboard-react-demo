import React from 'react';

const DownloadSampleCSVJustAddresses = () => {
    const data = [
        ['Recipient Address'],
        ['0x1234567890123456789012345678901234567890'],
        ['0x2345678901234567890123456789012345678901'],
        ['0x3456789012345678901234567890123456789012']
    ];

    const convertToCSV = (array) => {
        return array.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvContent = convertToCSV(data);
        const csvData = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const csvURL = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = csvURL;
        link.setAttribute('download', 'sample_recipients.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={downloadCSV}>Download Sample CSV</button>
    );
};

export default DownloadSampleCSVJustAddresses;