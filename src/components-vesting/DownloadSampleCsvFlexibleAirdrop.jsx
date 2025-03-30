import React from 'react';

function DownloadSampleCsvFlexibleAirdrop() {
    const downloadSampleCSV = () => {
        const sampleData = [
            ['address', 'amount'],
            ['0x1234567890123456789012345678901234567890', '100'],
            ['0x2345678901234567890123456789012345678901', '200'],
            ['0x3456789012345678901234567890123456789012', '300']
        ];

        const csvContent = sampleData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'sample_airdrop_data.csv');
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

export default DownloadSampleCsvFlexibleAirdrop;