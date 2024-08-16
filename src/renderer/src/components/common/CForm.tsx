import { Form, type FormProps } from "antd";

interface Props extends FormProps {
  children: React.ReactNode;
}

function CForm({ children, ...props }: Props) {
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      {...props}
      autoComplete="off"
      className="mt-4">
      {children}
    </Form>
  );
}

export default CForm;
