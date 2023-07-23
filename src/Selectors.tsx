import React, { useEffect } from "react";
import OVERLAYS from "./data/overlays.json";
import Form from 'react-bootstrap/Form';
import { Button, FloatingLabel, FormCheckProps, FormControlProps, FormSelectProps } from "react-bootstrap";
import { onUrlLinkedChange } from "./Utils";
import { URLParams } from "./URLParams";
import { Console } from "inspector";

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
        <URLLinkedSelect defaultValue={"All"} urlParam={URLParams.AREA} value={props.value} onChange={props.onChange}>
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
                        urlParam={URLParams.SEED} />
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

export interface Options {
  freeSpace: boolean;
  excludeNever: boolean;
  numberOfItems: number;
  numberOfLocations: number;
}

export const DEFAULT_OPTIONS: Options = {
  excludeNever: false,
  numberOfItems: 5,
  numberOfLocations: 10,
  freeSpace: false,
};

export function OptionSelector(props: {
  value: Options,
  onChange: (e: Options) => void
}) {
  // create form options for each option here
  const value = props.value || DEFAULT_OPTIONS;
  return <Form className="options">
    <Form.Group>
      <FloatingLabel controlId={"numberOfLocations"} label={"Number of items (default: 5)"}>
        <URLLinkedInput value={value.numberOfItems}
                        type={"number"}
                        onChange={(e) => {
                          props.onChange({
                            ...value,
                            numberOfItems: parseInt(e)
                          });
                        }}
                        defaultValue={"off"}
                        urlParam={URLParams.ITEM_COUNT} />
      </FloatingLabel>
    </Form.Group>
    <Form.Group>
      <FloatingLabel controlId={"numberOfLocations"} label={"Number of locations (default: 10)"}>
        <URLLinkedInput value={value.numberOfLocations}
                        type={"number"}
                        onChange={(e) => {
                          props.onChange({
                            ...value,
                            numberOfLocations: parseInt(e)
                          });
                        }}
                        defaultValue={"off"}
                        urlParam={URLParams.POIS_COUNT} />
      </FloatingLabel>
    </Form.Group>
    <Form.Group>
      <URLLinkedCheck checked={value.excludeNever}
                      onChange={(e) => {
                        props.onChange({
                          ...value,
                          excludeNever: e
                        });
                      }}
                      defaultValue={false}
                      urlParam={URLParams.EXCLUDE_MISSIONS}
                      label={"Exclude 'never' missions"} />
    </Form.Group>
    <Form.Group>
      <URLLinkedCheck checked={value.freeSpace}
                      onChange={(e) => {
                        props.onChange({
                          ...value,
                          freeSpace: e
                        });
                      }}
                      defaultValue={false}
                      urlParam={URLParams.HAS_FREE_SPACE}
                      label={"Use free space"} />
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
    } else if (typeof defaultValue === 'boolean') {
      return (value === 'true') as unknown as T;
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


interface URLLinkedCheckProps extends FormCheckProps {
  urlParam: string;
  defaultValue: any;
  onChange: (e: any) => void;
}

const URLLinkedCheck = (props: URLLinkedCheckProps) => {
  const { onChange, children, defaultValue, urlParam, ...rest } = props;
  useEffect(() => {
    console.log("checked", props.checked);
    onUrlLinkedChange(() => {
    }, urlParam)(props.checked);
  }, [props.checked, urlParam]);
  return <Form.Check {...rest}
                     onChange={onUrlLinkedChange(onChange, urlParam)}
  >{children}</Form.Check>;
};

