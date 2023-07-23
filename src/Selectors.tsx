import React, { useEffect } from "react";
import OVERLAYS from "./data/overlays.json";
import Form from 'react-bootstrap/Form';
import { Button, FloatingLabel, FormControlProps, FormSelectProps } from "react-bootstrap";
import { onUrlLinkedChange } from "./Utils";

export const DEFAULT_AREA = 'All';
export const getAreas = () => {
  return OVERLAYS.areas.map(area => area.name);
};

export function AreaSelector(props: {
  value: string,
  onChange: (e: any) => void,
  areaNames: string[]
}) {
  return <Form className={"area"}>
    <Form.Group>
      <FloatingLabel controlId={"area"} label={"Area"}>
        <URLLinkedSelect defaultValue={"All"} urlParam={"area"} value={props.value} onChange={props.onChange}>
          {props.areaNames.map(area => <option key={area} value={area}>{area}</option>)}
        </URLLinkedSelect>
      </FloatingLabel>
    </Form.Group>
  </Form>;
}

export function SeedSelector(props: { value: number, onChange: (e: any) => void, onClick: () => void }) {
  return <Form className="seed">
    <Form.Group>
      <FloatingLabel controlId={"seed"} label={"Seed"}>
        <URLLinkedInput type="number" value={props.value} defaultValue={"0"} onChange={props.onChange}
                        urlParam={"seed"} />
      </FloatingLabel>
      <Button onClick={props.onClick}>Generate New Seed</Button>
      <Button onClick={() => navigator.clipboard.writeText(
        `${window.location.href}`
      )}>
        Copy URL
      </Button>
    </Form.Group>
  </Form>;
}

export const getFromURL = <T, >(paramName: string, defaultValue: T) => {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(paramName);
  if (value) {
    // if T is a number, parse it as a number
    if (typeof defaultValue === 'number') {
      return parseInt(value) as unknown as T;
    }
    return value as unknown as T;
  }
  return defaultValue;
};

interface URLLinkedInputProps extends FormControlProps {
  urlParam: string;
  defaultValue: string;
  onChange: (e: any) => void;
}

const URLLinkedInput = (props: URLLinkedInputProps) => {
  const { onChange, children, defaultValue, urlParam, ...rest } = props;
  useEffect(() => {
    onUrlLinkedChange(() => {
    }, urlParam)(props.value);
  }, [props.value, urlParam]);
  return <Form.Control {...rest}
                       onChange={onUrlLinkedChange(onChange, urlParam)}
  >{children}</Form.Control>;
};

interface URLLinkedSelectProps extends FormSelectProps {
  urlParam: string;
  defaultValue: string;
  onChange: (e: any) => void;
}

const URLLinkedSelect = (props: URLLinkedSelectProps) => {
  const { onChange, children, defaultValue, urlParam, ...rest } = props;
  useEffect(() => {
    onUrlLinkedChange(() => {
    }, urlParam)(props.value);
  }, [props.value, urlParam]);
  return <Form.Select {...rest}
                      onChange={onUrlLinkedChange(onChange, urlParam)}
  >{children}</Form.Select>;
};

