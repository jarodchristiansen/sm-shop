import { useMemo, useState } from "react";
// import { addToCache, fetchCacheItem } from "../../utils/caching";
import styled from "styled-components";

interface AutoCompleteFieldsProps {
  setFormValue?: any;
  label: string;
  inputValue: string;
}

const AutoCompleteFields = ({
  setFormValue,
  label,
  inputValue,
}: AutoCompleteFieldsProps) => {
  const [suggestedOptions, setSuggestedOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(inputValue);

  console.log({ inputValue, selectedValue }, "IN INPUT");

  const fetchAutoSuggest = async (queryString: string) => {
    // let url = `https://api.aviationstack.com/v1/airports?access_key=c409ddd54e832099928e1aa13868e49a&search=${queryString}`;

    // let suggestOptions;
    // // TODO: Abstract caching/store/fetch logic into its own reusable
    // if (typeof cacheCheck == "undefined") {
    //   let result = await fetch(url).then((res) => {
    //     let clonedRes = res.clone();
    //     // let cached = addToCache("Airport Iatas", url, res);
    //     return clonedRes.json();
    //   });

    //   if (result?.data) {
    //     suggestOptions = result.data.filter((item: any) =>
    //       item.iata_code.includes(queryString.toUpperCase())
    //     );

    //     setSuggestedOptions(suggestOptions);
    //   }
    // } else {
    //   suggestOptions = cacheCheck.data.filter((item: any) =>
    //     item.iata_code.includes(queryString.toUpperCase())
    //   );

    let suggestOptions = [{ name: "Crust Dough", value: "Crust Dough" }];

    setSuggestedOptions(suggestOptions);
  };

  const handleSearch = (e: any) => {
    let name = e.target.name;
    let value = e.target.value;

    console.log("IN HANDLE SEARCH", { name, value });

    if (value.length > 2) {
      fetchAutoSuggest(value);
    }
  };

  const options = useMemo(() => {
    if (!suggestedOptions.length) return [];

    return suggestedOptions.map((item: any, idx) => {
      //TODO: Resolve using idx, but maintains order
      return (
        <option
          key={item.name}
          value={item.value}
          onClick={(e) => handleSelectChange(item.value)}
        >
          {item.name}
        </option>
      );
    });
  }, [suggestedOptions]);

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    setFormValue(value);
  };

  const clearValue = () => {
    setSuggestedOptions([]);
    setFormValue("");
    // Used solely to track deletion/autocomplete menu rendering
    setSelectedValue("");
  };

  return (
    <div>
      {!selectedValue && !!options.length && (
        <OptionHolderDiv>{options}</OptionHolderDiv>
      )}

      {!!selectedValue && (
        <InputColumn>
          <label htmlFor={label}>{label}</label>

          <div className="select-row">
            <select
              className="form-control"
              name={label}
              onChange={(e) => handleSelectChange(e.target.value)}
            >
              {options}
            </select>

            <button onClick={clearValue}>X</button>
          </div>
        </InputColumn>
      )}

      {!selectedValue && (
        <InputColumn>
          <label htmlFor={label}>{label}</label>
          <input
            className="form-control"
            name={label}
            onChange={handleSearch}
            defaultValue={inputValue}
          />
        </InputColumn>
      )}
    </div>
  );
};

const OptionHolderDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  :hover {
    cursor: pointer;
  }
  option {
    padding: 1rem;
    color: blue;
  }
`;

const InputColumn = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 30rem;
  margin: auto;
  gap: 0.5rem;
`;

export default AutoCompleteFields;
