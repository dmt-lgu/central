import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function TableStatus() {
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
    
      const permits = [
        { name: 'Business Permit', values: [12, 19, 3, 5] },
        { name: 'Barangay Clearance', values: [2, 3, 20, 5] },
        { name: 'Working Permit', values: [3, 10, 13, 15] },
        { name: 'Building Permit and Certificate of Occupancy', values: [15, 9, 10, 10] },
      ];
  return (
    <div className="overflow-auto w-full">
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
  )
}

export default TableStatus