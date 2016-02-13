import thing from "./thing";

it("should inline thing", function() {
	thing.should.be.eql("hoist");
});
