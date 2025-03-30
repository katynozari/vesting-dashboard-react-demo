import React from 'react';

function DownloadSampleCSVFlexible() {
    const downloadSampleCSV = () => {
        const sampleData = [
            ['address', 'amount', 'start', 'duration', 'unit', 'revocable'],
            ['0x1234567890123456789012345678901234567890', '100', '1630000000', '31536000', '12', 'true'],
            ['0x2345678901234567890123456789012345678901', '200', '1630086400', '15768000', '6', 'false'],
            ['0x3456789012345678901234567890123456789012', '300', '1630172800', '7884000', '3', 'true']
        ];

        const csvContent = sampleData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'sample_vesting_data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <button type="button" onClick={downloadSampleCSV} className="download-sample-btn">
            Download Sample CSV
        </button>
    );
}

export default DownloadSampleCSVFlexible;