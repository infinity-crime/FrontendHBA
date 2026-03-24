import { Form, Input, type FormInstance } from "antd";
import '../style/ProfileForm.css';

interface ChangePasswordProps {
  onSave:()  => void;
  form: FormInstance; 
}

export const ChangePassword = ({onSave, form}: ChangePasswordProps)=> {
  return (
    <div style={{ width: 250 }}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="currentPassword"
          label="Текущий пароль"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password size="small"  className='input-password-change'/>
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Новый пароль"
          rules={[
            { required: true, message: "Введите новый пароль" },
            { min: 8, message: "Минимум 8 символов" },
            {
              validator: (_, value) => {
                if (!/[A-Z]/.test(value)) return Promise.reject(new Error('Нужна заглавная буква'));
                if (!/\d/.test(value)) return Promise.reject(new Error('Нужна цифра'));
                if (!/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value)) return Promise.reject(new Error('Нужен спецсимвол'));
                return Promise.resolve();
              }
            } 
          ]}
        >
          <Input.Password size="small"  className='input-password-change'/>
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Подтверждение"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Пароли не совпадают")
                );
              },
            }),
          ]}
        >
         <Input.Password size="small" className='input-password-change'/>
        </Form.Item>

        <button
          className = 'edit-buttom-success-popover'
          onClick={onSave}>
          Изменить пароль
        </button>
      </Form>
    </div>
  );
};