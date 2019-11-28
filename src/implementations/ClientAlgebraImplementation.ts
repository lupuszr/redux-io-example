import ClientAlgebra from '../algebras/ClientAlgebra';
// import { IO, Success, Failure } from 'funfix';
// import L from 'luxon';

// type ClientId = string;
// type Client = {}
// type Balance = {}
// type Date = L.DateObject;
// type GroupId = string;
// type Group = {
//   capacity: number,
//   id: GroupId,
//   clients: Array<Client>,
//   dates: Array<Date>
// }
// type Filter = {}
// const clientAlgebraImp = new ClientAlgebra<ClientId, Client, Balance, Date, GroupId, Group, Filter>(
//   // addGroup
//   (newGroup: Group, groups: Array<Group>) => IO.of(() => [
//     newGroup.id, newGroup, [...groups, newGroup]
//   ]),
//   //  removeGroup
//   (id: GroupId, groups: Array<Group>) => {
//     const group = groups.find(g => g.id === id);
//     if (group) {
//       const remainingGroups = groups.filter(g => g.id !== group.id);
//       return IO.of(() => [group, remainingGroups])
//     } else {
//       return IO.raise("No such group")
//     }
//   },
//   // public listGroups: () => IO<Array<Group>>,
//   // () => {},
//   // public registerClient: (c: Client, d: Date, b: Balance) => IO<[ClientId, Client, Group]>,
//   (c: Client, d: Date, b: Balance, allGroups: Array<Group>) => {
//     allGroups.find(group => group.dates.find())
//   },
//   // public renewClient: (c: ClientId, b: Balance) => IO<Client>,
//   () => {},
//   // public clientInfo: (id: ClientId) => IO<[Client, Balance, Group]>,
//   () => {},
//   // public clientVisit: (id: ClientId, d: Date) => IO<[Client, Balance]>,
//   () => {},
//   // public listClients: (g: GroupId, f: Filter) => IO<[Array<Client>, Group]>,
//   () => {},
//   // public listAllClients: (f: Filter) => IO<Array<Client>>,
//   () => {},
// )