export default {
	async fetch(request, env, ctx): Promise<Response> {
		
		return Response.json({
			message:"HELLO WORLD",
			status:"OK"
		})
	},
} satisfies ExportedHandler<Env>;
