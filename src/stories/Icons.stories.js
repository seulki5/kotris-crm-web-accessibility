import * as Icons from '@assets/icons/Svgs';
import * as Kpass from '@assets/icons/Kpass';
import * as Navigation from '@assets/icons/Navigation';
import * as MobileMenu from '@assets/icons/MobileMenu';
import {
	BdgAdult, BdgApprovalCmptn,
	BdgApprovalImps,
	BdgApprovalRjct,
	BdgApprovalWait,
	BdgKid,
	BdgOff,
	BdgOn, BdgPostPaid, BdgPrepaid,
	BdgYouth
} from "@assets/icons/Badges";

const meta = {
	title: 'Design System/Icons',
	parameters: {
		layout: 'centered'
	}
}

export default meta

const iconSizes = [12, 16, 20, 24, 32, 40, 48]

const IconGrid = () => {
	
	const commonIcons = Object.entries(Icons).filter(([name]) => !['default', 'Logo'].includes(name));
	const kpassIcons = Object.entries(Kpass).filter(([name]) => !['default'].includes(name));
	const navigationIcons = Object.entries(Navigation).filter(([name]) => name !== 'default');
	const mobileMenuIcons = Object.entries(MobileMenu).filter(([name]) => name !== 'default');
	
	return (
		<div className="p-8 w-full">
			<div className="flex flex-col gap-[40px]">
				{commonIcons.map(([name, Icon]) => (
					<div key={name} className="space-y-4">
						<h3 className="text-lg font-semibold text-gray-900">{name}</h3>
						<div className="flex items-start gap-[24px]">
							{iconSizes.map((size) => (
								<div key={size} className="flex flex-col items-center gap-3">
									<div className="flex items-center justify-center">
										<Icon width={size} height={size}/>
									</div>
									<span className="text-xs text-gray-500">{size}px</span>
								</div>
							))}
						</div>
					</div>
				))}
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">K-pass(App Only)</h3>
					<div className="flex items-start gap-[24px]">
						{kpassIcons.map(([name, Icon]) => (
							<div className="flex flex-col items-center gap-3">
								<div className="flex items-center justify-center">
									<Icon width={50} height={32} />
								</div>
								<span className="text-xs text-gray-500">{name}</span>
								<span className="text-xs text-gray-500">50x32</span>
							</div>
						))}
						{kpassIcons.map(([name, Icon]) => (
							<div className="flex flex-col items-center gap-3">
								<div className="flex items-center justify-center">
									<Icon/>
								</div>
								<span className="text-xs text-gray-500">{name}</span>
								<span className="text-xs text-gray-500">60x38</span>
							</div>
						))}
					</div>
				</div>
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">Navigation(App Only)</h3>
					<div className="flex items-start gap-[24px] grid grid-cols-2">
						{navigationIcons.map(([name, Icon]) => (
							<div className="flex flex-col items-center gap-3">
								<div className="flex items-center justify-center">
									<Icon/>
								</div>
								<span className="text-xs text-gray-500">{name}</span>
							</div>
						))}
					</div>
				</div>
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">Mobile Menu(App Only)</h3>
					<div className="flex items-start gap-[24px] grid grid-cols-2">
						{mobileMenuIcons.map(([name, Icon]) => (
							<div className="flex flex-col items-center gap-3">
								<div className="flex items-center justify-center">
									<Icon/>
								</div>
								<span className="text-xs text-gray-500">{name}</span>
							</div>
						))}
					</div>
				</div>
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">NFC Status</h3>
					<div className="flex items-start gap-[24px] grid grid-cols-2">
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgOn/>
							</div>
							<span className="text-xs text-gray-500">BdgOn</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgOff/>
							</div>
							<span className="text-xs text-gray-500">BdgOff</span>
						</div>
					</div>
				</div>
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">권종 유형</h3>
					<div className="flex items-start gap-[24px] grid grid-cols-3">
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgAdult/>
							</div>
							<span className="text-xs text-gray-500">BdgAdult</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgKid/>
							</div>
							<span className="text-xs text-gray-500">BdgKid</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgYouth/>
							</div>
							<span className="text-xs text-gray-500">BdgYouth</span>
						</div>
					</div>
				</div>
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">선불/후불</h3>
					<div className="flex items-start gap-[24px] grid grid-cols-2">
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgPrepaid/>
							</div>
							<span className="text-xs text-gray-500">BdgPrep</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgPostPaid/>
							</div>
							<span className="text-xs text-gray-500">BdgDefp</span>
						</div>
					</div>
				</div>
				
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-gray-900">승인상태</h3>
					<div className="flex items-start gap-[24px] grid grid-cols-2">
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgApprovalCmptn/>
							</div>
							<span className="text-xs text-gray-500">BdgApprovalCmptn</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgApprovalWait/>
							</div>
							<span className="text-xs text-gray-500">BdgApprovalWait</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgApprovalImps/>
							</div>
							<span className="text-xs text-gray-500">BdgApprovalImps</span>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center justify-center">
								<BdgApprovalRjct/>
							</div>
							<span className="text-xs text-gray-500">BdgApprovalRjct</span>
						</div>
					</div>
				</div>
			
			</div>
		</div>
	)
}

export const Gallery = {
	render: () => <IconGrid/>
}
