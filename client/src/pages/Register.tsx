import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const Register: React.FC = () => {
  return (
    <div className="page-container">
      <div className="card p-8 max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
