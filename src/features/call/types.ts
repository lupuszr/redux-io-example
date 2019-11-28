import { Option } from "funfix"

export type Balance = {
  amount: number
}

export type Customer = {
  id: string,
  given_name: string,
  family_name: string,
  balance: Balance
}

export type Interpreter = {
  name: string
}

export type Call = {
  status: 'cancelled' | 'in_progress' | 'not_started' | 'ended' | 'reconnecting',
  room_id: Option<string>,
  length: number,
  interpreter: Option<Interpreter>,
  customer: Option<Customer>
}