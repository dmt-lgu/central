import  { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSelector } from 'react-redux';
import { selectData } from '@/redux/dataSlice';

function TableStatus() {
  const data = useSelector(selectData);
  const [permits, setPermits] = useState([
    { name: 'Business Permit', values: [0, 0, 0, 0] },
    { name: 'Barangay Clearance', values: [0, 0, 0, 0] },
    { name: 'Working Permit', values: [0, 0, 0, 0] },
    { name: 'Certificate of Occupancy', values: [0, 0, 0, 0] },
  ]);

  useEffect(() => {
    const calculateTotals = () => {
      const totals:any = {
        WP: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
        CO: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
        BP: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
        BC: { operational: 0, developmental: 0, training: 0, withdraw: 0 },
      };

      Object.entries(data).forEach(([permitType, permitData]:any) => {
        permitData.forEach((monthData: any) => {
          monthData.data.forEach((regionData: any) => {
            totals[permitType].operational += regionData.operational;
            totals[permitType].developmental += regionData.developmental;
            totals[permitType].training += regionData.training;
            totals[permitType].withdraw += regionData.withdraw;
          });
        });
      });

      setPermits([
        {
          name: 'Business Permit',
          values: [
            totals.BP.operational,
            totals.BP.developmental,
            totals.BP.training,
            totals.BP.withdraw,
          ],
        },
        {
          name: 'Barangay Clearance',
          values: [
            totals.BC.operational,
            totals.BC.developmental,
            totals.BC.training,
            totals.BC.withdraw,
          ],
        },
        {
          name: 'Working Permit',
          values: [
            totals.WP.operational,
            totals.WP.developmental,
            totals.WP.training,
            totals.WP.withdraw,
          ],
        },
        {
          name: 'Certificate of Occupancy',
          values: [
            totals.CO.operational,
            totals.CO.developmental,
            totals.CO.training,
            totals.CO.withdraw,
          ],
        },
      ]);
    };

    calculateTotals();
  }, [data]);

  const getStatusColor = (category: any) => {
    switch (category) {
      case 'Operational':
        return '#0136A8';
      case 'Developmental':
        return '#F8CD1C';
      case 'For Training/Others':
        return '#CE1126';
      case 'Withdraw':
        return '#72CFF1';
      default:
        return 'transparent';
    }
  };

  const statuses = [
    { category: 'Operational', color: 'bg-gray-100 ' },
    { category: 'Developmental', color: 'bg-white' },
    { category: 'For Training/Others', color: 'bg-gray-100 ' },
    { category: 'Withdraw', color: 'bg-white' },
  ];

  return (
    <div className="w-full">
      <Table className="min-w-full bg-white border border-gray-200">
        <TableHeader className="bg-white">
          <TableRow className="border-b">
            <TableHead className="py-2 px-4 border border-gray-200"></TableHead>
            {permits.map((permit) => (
              <TableHead key={permit.name} className="py-2 px-4 border border-gray-200">
                {permit.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map((status, rowIndex) => (
            <TableRow key={status.category} className={`border-b ${status.color}`}>
              <TableCell className="py-2 px-4 border border-gray-200">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 mr-2 border"
                    style={{ backgroundColor: getStatusColor(status.category) }}
                  ></div>
                  {status.category}
                </div>
              </TableCell>
              {permits.map((permit) => (
                <TableCell key={permit.name} className="py-2 px-4 border border-gray-200">
                  {permit.values[rowIndex]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableStatus;