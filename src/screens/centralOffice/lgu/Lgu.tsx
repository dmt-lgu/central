import axios from "./../../../plugin/axios";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { debounce } from "lodash";

interface LGU {
  geocode: string;
  lguFullName: string;  // Changed from name
  province: string;
  region: string;
  district: string;
  level: string;
  incomeClass: string;
  monthlyStatus: string;  // Changed from utilizationStatus
  // Add other fields as needed
}

interface LGUData {
  lguFullName: string;
  monthlyStatus: string;
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

const LGU: React.FC = () => {
  const [lguList, setLguList] = useState<LGUData[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedLGU, setSelectedLGU] = useState<LGU | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Debounce the search update
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
      monthlyStatus: lgu.monthlyStatus
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


  function transformLGUData(rawData: string[][]) {
    // Skip header rows (first 3 rows)
    const allLGUs = rawData.slice(3).map(row => ({
      lguFullName: row[4] || '',
      monthlyStatus: row[5] || '',
      progressRate: row[6] || '',
      concerns: row[7] || '',
      actionItems: row[8] || '',
      otherRemarks: row[9] || '',
      universalStatus: row[10] || '',
      mpar: row[11] || '',
      geocode: row[12] || '',
      cm: row[13] || '',
      province: row[14] || '',
      region: row[15] || '',
      district: row[16] || '',
      level: row[17] || '',
      incomeClass: row[18] || '',
      dictRo: row[19] || '',
      sort: row[20] || ''
    }));

    // Create a Map to store unique LGUs using geocode as the key
    const uniqueLGUs = new Map();
    
    allLGUs.forEach(lgu => {
      // Only store the first occurrence of each LGU
      if (!uniqueLGUs.has(lgu.geocode)) {
        uniqueLGUs.set(lgu.geocode, lgu);
      }
    });

    // Convert Map back to array
    return Array.from(uniqueLGUs.values());
  }

  function GetLGUs() {
    axios.get('18kaPQlN0_kA9i7YAD-DftbdVPZX35Qf33sVMkw_TcWc/values/BP1 UR Input', {
      headers: {
        Authorization: `Token ${import.meta.env.VITE_TOKEN}`,
      },
    }).then((response) => {
      const rawData = response.data.values;
      const transformedData = transformLGUData(rawData);
      console.log(transformedData);
      setLguList(transformedData);
    }).catch(error => {
      console.error('Error fetching LGU data:', error);
    });
  }

  useEffect(() => {
    GetLGUs();
  }, []);

  return (
    <div className="w-full h-full px-5 flex flex-col items-center gap-10">
      <div className="bg-[#EBEFF5] border md:mt-20 border-border flex flex-col px-10 py-4 rounded w-[80%] md:w-full relative">
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

      <div className="mt-6 w-[60%] md:w-full self-center flex rounded-md bg-white border border-border">
        <table className="w-full text-left rounded-2xl overflow-hidden border border-border">
          <tbody>
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
              <td className="py-3 px-4 border border-border font-gsemibold text-[#8E8E8E] text-sm">{selectedLGU?.monthlyStatus || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LGU;