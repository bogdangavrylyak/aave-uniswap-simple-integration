// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
// import './TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "hardhat/console.sol";

contract SimpleSwap {
    ISwapRouter public immutable swapRouter;
    // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public immutable DAI;
    address public immutable WETH9;
    uint24 public constant feeTier = 3000;
    
    constructor(ISwapRouter _swapRouter, address daiAddress, address wethAddress) {
        swapRouter = _swapRouter;
        DAI = daiAddress;
        WETH9 = wethAddress;
    }
    
    function swapWETHForDAI(uint amountIn) external returns (uint256 amountOut) {
        console.log("WETH9: ", WETH9);
        console.log("msg.sender: ", msg.sender);
        console.log("amountIn: ", amountIn);
        console.log("address(this): ", address(this));

        // Transfer the specified amount of WETH9 to this contract.
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
        // Approve the router to spend WETH9.
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);
        // Create the params that will be used to execute the swap
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: DAI,
                fee: feeTier,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        return amountOut; 
    }
}
