/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { encryptData, userData } from '../../../helper/auth';
import { sendEmail } from '../../../http-requests/requests';

const EmailVerification = () => {
  const user = userData()
  
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(user.isEmailVerification || false);
  const [timer, setTimer] = useState(180);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let interval;
    if (isCodeSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleResendCode();
    }
    return () => clearInterval(interval);
  }, [isCodeSent, timer]);

  const generateSixDigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const handleSendCode = async() => {
    if (isVerified) {
      message.info('Emailiniz zaten doğrulanmıştır.');
    } else {
      const code = generateSixDigitCode();
      setVerificationCode(code);
      setIsCodeSent(true);
      setTimer(180);

      const res = await sendEmail(code, true)

      res && message.success(`${user.email} adlı emailinize kod gönderilmiştir. Lütfen spam kutusunu kontrol ediniz.`)
    }
  };

  const handleVerifyCode = () => {
    if (inputCode === verificationCode.toString()) {
      const newUser = {...user, isEmailVerification: true}
      encryptData(newUser, "user");

      message.success('Emailiniz başarıyla doğrulanmıştır.', 3);
      setTimeout(() => {
        setIsVerified(true)
      }, 3000);
    } else {
      message.error('Kod doğru değildir.');
    }
  };

  const handleResendCode = () => {
    setAttempts(prev => prev + 1);
    if (attempts < 3) {
      handleSendCode();
    } else {
      message.error('Bir sorun oluştu, daha sonra tekrar deneyin lütfen.');
    }
  };

  return (
    <div>
      {!isVerified ? (
        <Form layout="vertical" onFinish={handleVerifyCode}>
          {!isCodeSent ? (
            <>
              <Button type="primary" onClick={handleSendCode}>
                Doğrulama Kodu Gönder
              </Button>
            </>
          ) : (
            <>
              <p>{user.email} adlı emailinize kod gönderilmiştir. Lütfen spam kutusunu kontrol ediniz.</p>
              <Form.Item
                label="Doğrulama Kodu"
                rules={[{ required: true, message: 'Lütfen doğrulama kodunu giriniz!' }]}
              >
                <Input
                  placeholder="6 basamaklı kodu giriniz"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Kodu Doğrula
              </Button>
              <p>{`Kalan süre: ${Math.floor(timer / 60)}:${timer % 60}`}</p>
            </>
          )}
        </Form>
      ) : (
        <p>Emailiniz zaten doğrulanmıştır.</p>
      )}
    </div>
  );
};

export default EmailVerification;
