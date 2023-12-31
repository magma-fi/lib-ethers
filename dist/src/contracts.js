"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._connectToContracts = exports._uniTokenIsMock = exports._priceFeedIsTestnet = exports._LiquityContract = void 0;
const contracts_1 = require("@ethersproject/contracts");
const ActivePool_json_1 = __importDefault(require("../abi/ActivePool.json"));
const BorrowerOperations_json_1 = __importDefault(require("../abi/BorrowerOperations.json"));
const TroveManager_json_1 = __importDefault(require("../abi/TroveManager.json"));
const LUSDToken_json_1 = __importDefault(require("../abi/LUSDToken.json"));
const CollSurplusPool_json_1 = __importDefault(require("../abi/CollSurplusPool.json"));
const CommunityIssuance_json_1 = __importDefault(require("../abi/CommunityIssuance.json"));
const DefaultPool_json_1 = __importDefault(require("../abi/DefaultPool.json"));
const LQTYToken_json_1 = __importDefault(require("../abi/LQTYToken.json"));
const HintHelpers_json_1 = __importDefault(require("../abi/HintHelpers.json"));
const LockupContractFactory_json_1 = __importDefault(require("../abi/LockupContractFactory.json"));
const LQTYStaking_json_1 = __importDefault(require("../abi/LQTYStaking.json"));
const MultiTroveGetter_json_1 = __importDefault(require("../abi/MultiTroveGetter.json"));
const PriceFeed_json_1 = __importDefault(require("../abi/PriceFeed.json"));
const PriceFeedTestnet_json_1 = __importDefault(require("../abi/PriceFeedTestnet.json"));
const SortedTroves_json_1 = __importDefault(require("../abi/SortedTroves.json"));
const StabilityPool_json_1 = __importDefault(require("../abi/StabilityPool.json"));
const GasPool_json_1 = __importDefault(require("../abi/GasPool.json"));
const Unipool_json_1 = __importDefault(require("../abi/Unipool.json"));
const IERC20_json_1 = __importDefault(require("../abi/IERC20.json"));
const ERC20Mock_json_1 = __importDefault(require("../abi/ERC20Mock.json"));
const buildEstimatedFunctions = (estimateFunctions, functions) => Object.fromEntries(Object.keys(estimateFunctions).map(functionName => [
    functionName,
    async (overrides, adjustEstimate, ...args) => {
        if (overrides.gasLimit === undefined) {
            const estimatedGas = await estimateFunctions[functionName](...args, overrides);
            overrides = {
                ...overrides,
                gasLimit: adjustEstimate(estimatedGas)
            };
        }
        return functions[functionName](...args, overrides);
    }
]));
class _LiquityContract extends contracts_1.Contract {
    constructor(addressOrName, contractInterface, signerOrProvider) {
        super(addressOrName, contractInterface, signerOrProvider);
        // this.estimateAndCall = buildEstimatedFunctions(this.estimateGas, this);
        this.estimateAndPopulate = buildEstimatedFunctions(this.estimateGas, this.populateTransaction);
    }
    extractEvents(logs, name) {
        return logs
            .filter(log => log.address === this.address)
            .map(log => this.interface.parseLog(log))
            .filter(e => e.name === name);
    }
}
exports._LiquityContract = _LiquityContract;
/** @internal */
const _priceFeedIsTestnet = (priceFeed) => "setPrice" in priceFeed;
exports._priceFeedIsTestnet = _priceFeedIsTestnet;
/** @internal */
const _uniTokenIsMock = (uniToken) => "mint" in uniToken;
exports._uniTokenIsMock = _uniTokenIsMock;
const getAbi = (priceFeedIsTestnet, uniTokenIsMock) => ({
    activePool: ActivePool_json_1.default,
    borrowerOperations: BorrowerOperations_json_1.default,
    troveManager: TroveManager_json_1.default,
    lusdToken: LUSDToken_json_1.default,
    communityIssuance: CommunityIssuance_json_1.default,
    defaultPool: DefaultPool_json_1.default,
    lqtyToken: LQTYToken_json_1.default,
    hintHelpers: HintHelpers_json_1.default,
    lockupContractFactory: LockupContractFactory_json_1.default,
    lqtyStaking: LQTYStaking_json_1.default,
    multiTroveGetter: MultiTroveGetter_json_1.default,
    priceFeed: priceFeedIsTestnet ? PriceFeedTestnet_json_1.default : PriceFeed_json_1.default,
    sortedTroves: SortedTroves_json_1.default,
    stabilityPool: StabilityPool_json_1.default,
    gasPool: GasPool_json_1.default,
    collSurplusPool: CollSurplusPool_json_1.default,
    unipool: Unipool_json_1.default,
    uniToken: uniTokenIsMock ? ERC20Mock_json_1.default : IERC20_json_1.default
});
const mapLiquityContracts = (contracts, f) => Object.fromEntries(Object.entries(contracts).map(([key, t]) => {
    const res = [key, f(t, key)];
    console.debug("lib-ethers: mapLiquityContracts() res =", res);
    return res;
}));
/** @internal */
const _connectToContracts = (signerOrProvider, { addresses, _priceFeedIsTestnet, _uniTokenIsMock }) => {
    console.debug("lib-ethers: 检查合约是否存在 _connectToContracts() 参数", addresses);
    const abi = getAbi(_priceFeedIsTestnet, _uniTokenIsMock);
    return mapLiquityContracts(addresses, (address, key) => {
        console.debug("lib-ethers: 检查合约是否存在 遍历", address, key, !!address, address === "");
        if (address) {
            const res = new _LiquityContract(address, abi[key], signerOrProvider);
            return res;
        }
    });
};
exports._connectToContracts = _connectToContracts;
//# sourceMappingURL=contracts.js.map