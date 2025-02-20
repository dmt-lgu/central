import axios from "./../../../plugin/axios";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { debounce} from "lodash";


interface LGU {
  geocode: string;
  lguFullName: string;
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  monthlyStatus: string;
}

interface LGUData {
  lguFullName: string;
  monthlyStatus: Record<string, string>;
  progressRate: string;
  concerns: string;
  actionItems: string;
  otherRemarks: string;
  universalStatus: string;
  mpar: string;
  geocode: string;
  cm: string;
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  dictRo: string;
  sort: string;
}

const API_ENDPOINTS = {
  BP: '18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BP1 UR Input',
  CO: '18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BPCO UR Input',
  WP: '18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/WP UR Input',
  BC: '18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BC UR Input'
};

const LGU: React.FC = () => {
  const [lguList, setLguList] = useState<LGUData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedLGU, setSelectedLGU] = useState<LGU | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [statusMap, _setStatusMap] = useState<Map<string, Record<string, string>>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 700),
    []
  );

  useEffect(() => {

    if (search === "") {
      setSelectedLGU(null);
      setDebouncedSearch("");
    } else {
      debouncedSetSearch(search);
    }
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [search, debouncedSetSearch]);



  const filteredLGUs = useMemo(
    () =>
      lguList.filter(
        (lgu) =>
          lgu.lguFullName?.toLowerCase().includes(debouncedSearch?.toLowerCase())
      ),
    [debouncedSearch, lguList]
  );

  const fetchData = async (endpoint: string, serviceType: string) => {
    try {
      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Token ${import.meta.env.VITE_TOKEN}` }
      });
      return transformLGUData(data.values, serviceType);
    } catch (error) {
      console.error(`Error fetching ${serviceType} data:`, error);
      return [];
    }
  };

  function transformLGUData(rawData: string[][], serviceType: string) {
    const records = rawData.slice(3);
    const processedData = new Map();

    records.forEach(row => {
      const geocode = row[12];
      if (!geocode) return;

      const status = row[10]?.slice(4) || '';
      const currentStatuses = statusMap.get(geocode) || {};
      
      statusMap.set(geocode, {
        ...currentStatuses,
        [serviceType]: status
      });

      if (serviceType === 'BP' || !processedData.has(geocode)) {
        processedData.set(geocode, {
          lguFullName: row[4] || '',
          monthlyStatus: { [serviceType]: status },
          progressRate: row[6] || '',
          concerns: row[7] || '',
          actionItems: row[8] || '',
          otherRemarks: row[9] || '',
          universalStatus: row[10] || '',
          mpar: row[11] || '',
          geocode,
          cm: row[13] || '',
          province: row[14] || '',
          region: row[15] || '',
          district: row[16] || '',
          level: row[17] || '',
          incomeClass: row[18] || '',
          dictRo: row[18] || '',
          sort: row[19] || ''
        });
      } else {
        const existing = processedData.get(geocode);
        existing.monthlyStatus[serviceType] = status;
      }
    });

    return Array.from(processedData.values());
  }

  const formatMonthlyStatus = (statuses: Record<string, string>) => {
    return Object.entries(statuses)
      .map(([service, status]) => `${service}: ${status}`)
      .join(' | ');
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const requests = Object.entries(API_ENDPOINTS).map(([type, endpoint]) => 
        fetchData(endpoint, type)
      );

      const results = await Promise.all(requests);
      
      // Merge all results efficiently
      const mergedData = results.flat().reduce((acc, curr) => {
        const existingIndex = acc.findIndex((item:any) => item.geocode === curr.geocode);
        if (existingIndex === -1) {
          acc.push(curr);
        } else {
          acc[existingIndex].monthlyStatus = {
            ...acc[existingIndex].monthlyStatus,
            ...curr.monthlyStatus
          };
        }
        return acc;
      }, [] as LGUData[]);

      setLguList(mergedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllData();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (selectedLGU && lguList.length > 0) {
      const updatedLgu = lguList.find(lgu => lgu.geocode === selectedLGU.geocode);
      if (updatedLgu) {
        setSelectedLGU({
          geocode: updatedLgu.geocode,
          lguFullName: updatedLgu.lguFullName,
          province: updatedLgu.province,
          region: updatedLgu.region,
          district: updatedLgu.district,
          level: updatedLgu.level,
          incomeClass: updatedLgu.incomeClass,
          monthlyStatus: formatMonthlyStatus(updatedLgu.monthlyStatus)
        });
      }
    }
  }, [lguList]);

  const handleSelect = (lgu: LGUData) => {
    setSearch(lgu.lguFullName);
    setSelectedLGU({
      geocode: lgu.geocode,
      lguFullName: lgu.lguFullName,
      province: lgu.province,
      region: lgu.region,
      district: lgu.district,
      level: lgu.level,
      incomeClass: lgu.incomeClass,
      monthlyStatus: formatMonthlyStatus(lgu.monthlyStatus)
    });
    setShowSuggestions(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (search && filteredLGUs.length > 0) {
      setShowSuggestions(true);
    }
  };

  const LoadingSkeleton = () => (
    <tr>
      <td colSpan={2} className="py-3 px-4 border border-border">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="w-full h-full px-5 flex flex-col items-center gap-10 md:mt-52">
      <div className="bg-[#EBEFF5] border border-border flex flex-col px-10 py-4 rounded w-[80%] md:w-full relative">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="search" className="block text-[#6B6B6B] font-gmedium">
            LGU
          </label>
          <div className="relative">
            <input
              type="search"
              id="search"
              className="w-full p-2 border outline-[#6B6B6B] text-[#6B6B6B] font-gregular pl-4 rounded-sm"
              placeholder="Search LGU"
              value={search}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
            />
            {showSuggestions && search && filteredLGUs.length > 0 && (
              <ul className="absolute bg-white border rounded mt-2 shadow w-full z-10 max-h-60 overflow-y-auto">
                {filteredLGUs.map((lgu) => (
                  <li
                    key={lgu.geocode}
                    className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelect(lgu)}
                  >
                    {lgu.lguFullName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 w-[60%] md:w-full md:mb-10 self-center flex rounded-md bg-white border border-border">
        <table className="w-full text-left rounded-2xl overflow-hidden border border-border">
          <tbody>
            {isLoading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : (
              <>
                <tr>
                  <th className="py-2 w-[40%] px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Geocode</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.geocode || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Name</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.lguFullName || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Province</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.province || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Region</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.region || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">District</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.district || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Level</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.level || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Income Class</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.incomeClass || "-"}</td>
                </tr>
                <tr>
                  <th className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">Utilization Status</th>
                  <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.monthlyStatus|| "-"}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LGU;