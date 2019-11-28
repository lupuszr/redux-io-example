import * as readline from 'readline';
import { Option, None, Cancelable, Future, Success, IO, Duration, TestScheduler, GlobalScheduler, ExecutionModel, Try, ICancelable, Some, Failure } from "funfix"

/**
 *
 *
 * @export
 * @class ClientAlgebra
 * @template ClientId - Id of Client type
 * @template Client - Client object, contain all info regarding clinet
 * @template Balance - Client balance
 * @template Date
 * @template GroupId
 * @template Group
 * @template Filter
 */
export default class ClientAlgebra<ClientId, Client, Balance, Date, GroupId, Group, Filter> {
  /**
   *Creates an instance of ClientAlgebra.
   * @param {(g: Group, groups: Array<Group>) => IO<[GroupId, Group, Array<Group>]>} addGroup
   * @param {(id: GroupId) => IO<[Group, Array<Group>]>} removeGroup
   * @param {() => IO<Array<Group>>} listGroups
   * @param {(c: Client, d: Date, b: Balance) => IO<[ClientId, Client, Group]>} registerClient
   * @param {(c: ClientId, b: Balance) => IO<Client>} renewClient
   * @param {(id: ClientId) => IO<[Client, Balance, Group]>} clientInfo
   * @param {(id: ClientId, d: Date) => IO<[Client, Balance]>} clientVisit
   * @param {(g: GroupId, f: Filter) => IO<[Array<Client>, Group]>} listClients
   * @param {(f: Filter) => IO<Array<Client>>} listAllClients
   * @memberof ClientAlgebra
   */
  constructor(
    public addGroup: (g: Group, groups: Array<Group>) => IO<[GroupId, Group, Array<Group>]>,
    public removeGroup: (id: GroupId, groups: Array<Group>) => IO<[Group, Array<Group>]>,
    public listPossibleGroups: (d: Date, allGroups: Array<Group>) => IO<Array<Group>>,
    public registerClient: (c: Client, d: Date, b: Balance, allGroups: Array<Group>) => IO<[ClientId, Client, Group]>,
    public renewClient: (c: ClientId, b: Balance, allGroups: Array<Group>) => IO<Client>,
    public clientInfo: (id: ClientId, allGroups: Array<Group>) => IO<[Client, Balance, Group]>,
    public clientVisit: (id: ClientId, d: Date,  allGroups: Array<Group>) => IO<[Client, Balance]>,
    public listClients: (g: GroupId, f: Filter, allGroups: Array<Group>) => IO<[Array<Client>, Group]>,
    public listAllClients: (f: Filter, allGroups: Array<Group>) => IO<Array<Client>>,
  ) {}
}
