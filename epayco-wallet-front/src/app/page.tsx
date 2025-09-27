"use client";

import { FormEvent, useMemo, useState } from "react";

type ApiResponse<T = unknown> = {
  success: boolean;
  code: string;
  message: string;
  data?: T;
};

type WalletBalance = {
  walletBalance: number;
};

type PaymentInitData = {
  sessionId: string;
  token: string;
  expiresAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function callApi<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    const payload = await response.json().catch(() => null);

    if (payload && typeof payload.success === "boolean" && payload.code && payload.message) {
      return payload as ApiResponse<T>;
    }

    if (!response.ok) {
      return {
        success: false,
        code: "UNEXPECTED_RESPONSE",
        message: "El servicio respondió en un formato no esperado",
      };
    }

    return {
      success: true,
      code: "SUCCESS",
      message: "Operación exitosa",
      data: payload ?? undefined,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      code: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

function ResponseAlert({ response }: { response: ApiResponse | null }) {
  if (!response) return null;
  const tone = response.success ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-rose-50 text-rose-900 border-rose-200";
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${tone}`}>
      <p className="font-semibold">{response.code}</p>
      <p>{response.message}</p>
      {response.data && (
        <pre className="mt-2 bg-white/60 rounded-md p-2 text-xs overflow-x-auto">
          {JSON.stringify(response.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function Home() {
  const [registerForm, setRegisterForm] = useState({ document: "", names: "", email: "", phone: "" });
  const [registerResponse, setRegisterResponse] = useState<ApiResponse | null>(null);

  const [topUpForm, setTopUpForm] = useState({ document: "", phone: "", amount: "" });
  const [topUpResponse, setTopUpResponse] = useState<ApiResponse<WalletBalance> | null>(null);

  const [paymentForm, setPaymentForm] = useState({ document: "", phone: "", amount: "", description: "" });
  const [paymentResponse, setPaymentResponse] = useState<ApiResponse<PaymentInitData> | null>(null);

  const [confirmForm, setConfirmForm] = useState({ sessionId: "", token: "" });
  const [confirmResponse, setConfirmResponse] = useState<ApiResponse<WalletBalance> | null>(null);

  const [balanceForm, setBalanceForm] = useState({ document: "", phone: "" });
  const [balanceResponse, setBalanceResponse] = useState<ApiResponse<WalletBalance> | null>(null);

  const lastSessionId = useMemo(() => paymentResponse?.data?.sessionId ?? "", [paymentResponse]);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await callApi<WalletBalance>("/api/clients/register", {
      method: "POST",
      body: JSON.stringify(registerForm),
    });
    setRegisterResponse(response);
  };

  const handleTopUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await callApi<WalletBalance>("/api/wallets/top-up", {
      method: "POST",
      body: JSON.stringify({ ...topUpForm, amount: Number(topUpForm.amount) || topUpForm.amount }),
    });
    setTopUpResponse(response);
  };

  const handlePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await callApi<PaymentInitData>("/api/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ ...paymentForm, amount: Number(paymentForm.amount) || paymentForm.amount }),
    });
    setPaymentResponse(response);
    if (response.success && response.data?.sessionId) {
      setConfirmForm({
        sessionId: response.data.sessionId,
        token: response.data.token,
      });
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await callApi<WalletBalance>("/api/payments/confirm", {
      method: "POST",
      body: JSON.stringify(confirmForm),
    });
    setConfirmResponse(response);
  };

  const handleBalance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new URLSearchParams(balanceForm).toString();
    const response = await callApi<WalletBalance>(`/api/wallets/balance?${query}`);
    setBalanceResponse(response);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-indigo-600 text-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-semibold">ePaycoWallet</h1>
          <p className="mt-2 text-indigo-100">Gestiona clientes, recargas y pagos de tu billetera virtual.</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid gap-8 px-6 -mt-8">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800">Registro de cliente</h2>
          <p className="text-sm text-slate-500 mb-6">Crea una billetera asociada a un nuevo cliente.</p>
          <form onSubmit={handleRegister} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Documento
              <input
                value={registerForm.document}
                onChange={(event) => setRegisterForm({ ...registerForm, document: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700 sm:col-span-2">
              Nombres
              <input
                value={registerForm.names}
                onChange={(event) => setRegisterForm({ ...registerForm, names: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Celular
              <input
                value={registerForm.phone}
                onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              >
                Registrar cliente
              </button>
            </div>
          </form>
          <div className="mt-4">
            <ResponseAlert response={registerResponse} />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800">Recarga de billetera</h2>
          <p className="text-sm text-slate-500 mb-6">Acredita saldo disponible en la billetera del cliente.</p>
          <form onSubmit={handleTopUp} className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Documento
              <input
                value={topUpForm.document}
                onChange={(event) => setTopUpForm({ ...topUpForm, document: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Celular
              <input
                value={topUpForm.phone}
                onChange={(event) => setTopUpForm({ ...topUpForm, phone: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Valor a recargar
              <input
                type="number"
                min="1"
                value={topUpForm.amount}
                onChange={(event) => setTopUpForm({ ...topUpForm, amount: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              >
                Recargar billetera
              </button>
            </div>
          </form>
          <div className="mt-4">
            <ResponseAlert response={topUpResponse} />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800">Generar pago</h2>
          <p className="text-sm text-slate-500 mb-6">
            Se enviará un token de seis dígitos al correo del cliente para confirmar la transacción.
          </p>
          <form onSubmit={handlePayment} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Documento
              <input
                value={paymentForm.document}
                onChange={(event) => setPaymentForm({ ...paymentForm, document: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Celular
              <input
                value={paymentForm.phone}
                onChange={(event) => setPaymentForm({ ...paymentForm, phone: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Valor del pago
              <input
                type="number"
                min="1"
                value={paymentForm.amount}
                onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Descripción (opcional)
              <input
                value={paymentForm.description}
                onChange={(event) => setPaymentForm({ ...paymentForm, description: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Compra en tienda"
              />
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              >
                Generar token de pago
              </button>
            </div>
          </form>
          <div className="mt-4 space-y-4">
            <ResponseAlert response={paymentResponse} />
            {paymentResponse?.success && paymentResponse.data && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                <p className="font-semibold">Token generado</p>
                <p className="mt-1">
                  Utiliza el token mostrado a continuación para confirmar la compra. También fue enviado al correo del cliente.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-indigo-700">ID de sesión</p>
                    <p className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-base font-semibold text-indigo-900">
                      {paymentResponse.data.sessionId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-indigo-700">Token de confirmación</p>
                    <p className="mt-1 rounded-md bg-white px-3 py-2 font-mono text-lg font-semibold text-indigo-900">
                      {paymentResponse.data.token}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-indigo-700">
                  Expira el {new Date(paymentResponse.data.expiresAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800">Confirmar pago</h2>
          <p className="text-sm text-slate-500 mb-6">Valida el token recibido por correo para descontar el saldo de la billetera.</p>
          <form onSubmit={handleConfirm} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              ID de sesión
              <input
                value={confirmForm.sessionId}
                onChange={(event) => setConfirmForm({ ...confirmForm, sessionId: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder={lastSessionId ? `Sugerido: ${lastSessionId}` : ""}
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Token de confirmación
              <input
                value={confirmForm.token}
                onChange={(event) => setConfirmForm({ ...confirmForm, token: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder={paymentResponse?.data?.token ? `Sugerido: ${paymentResponse.data.token}` : ""}
              />
            </label>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              >
                Confirmar pago
              </button>
            </div>
          </form>
          <div className="mt-4">
            <ResponseAlert response={confirmResponse} />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800">Consultar saldo</h2>
          <p className="text-sm text-slate-500 mb-6">Obtén el saldo actual de la billetera con documento y celular.</p>
          <form onSubmit={handleBalance} className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Documento
              <input
                value={balanceForm.document}
                onChange={(event) => setBalanceForm({ ...balanceForm, document: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Celular
              <input
                value={balanceForm.phone}
                onChange={(event) => setBalanceForm({ ...balanceForm, phone: event.target.value })}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </label>
            <div className="sm:col-span-1 flex items-end justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
              >
                Consultar saldo
              </button>
            </div>
          </form>
          <div className="mt-4">
            <ResponseAlert response={balanceResponse} />
          </div>
        </section>
      </div>
    </main>
  );
}
