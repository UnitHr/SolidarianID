import { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { odsData, ODSEnum } from '../utils/ods';

interface OdsDropdownProps {
  selected: ODSEnum[];
  onChange: (selected: ODSEnum[]) => void;
}

export function OdsDropdown({ selected, onChange }: OdsDropdownProps) {
  const [show, setShow] = useState(false);

  const toggleItem = (id: ODSEnum) => {
    const updated = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    onChange(updated);
  };

  return (
    <Dropdown show={show} onToggle={(isOpen) => setShow(isOpen)}>
      <Dropdown.Toggle variant="light" id="dropdown-ods" className="w-100 text-start">
        {selected.length > 0 ? `${selected.length} selected` : 'Select ODS'}
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {Object.values(odsData).map((ods) => (
          <Form.Check
            key={ods.id}
            type="checkbox"
            id={`ods-${ods.id}`}
            label={ods.title}
            checked={selected.includes(ods.id)}
            onChange={() => toggleItem(ods.id)}
            className="mb-1"
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
