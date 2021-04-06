using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BillSystem.Models;

namespace BillSystem.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class CustomersController : Controller
    {
        private readonly BillContext _context;

        public CustomersController(BillContext context)
        {
            _context = context;
        }

        // GET: Customers
        [HttpGet]
        public async Task<List<Customer>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }


        // GET: Customers/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(m => m.Id == id);
            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }

        // GET: Customers/Create
        //public IActionResult Create()
        //{
        //    return View();
        //}

        // POST: Customers/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Create(Customer customer)
        {
            if (ModelState.IsValid)
            {
                _context.Add(customer);
                await _context.SaveChangesAsync();
                return Json(new { isSuccess = true, Message = "New customer has been added" });
            }
            else
            {
                return Json(new { isSuccess = false, Message = "Failed to create new customer" });
            }
        }



        // GET: Customers/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return View(customer);
        }



        // POST: Customers/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPut]
        public async Task<IActionResult> Edit([Bind("Id,Name,Phone")] [FromBody] Customer customer)
        {

            if (ModelState.IsValid)
            {
                try
                {
                    var theCustomer = _context.Customers.SingleOrDefault(x => x.Id == customer.Id);

                    if (theCustomer == null) return Json(new { isSuccess = false, Message = "Cannot find this row" }); ;

                    theCustomer.Name = customer.Name;
                    theCustomer.Phone = customer.Phone;

                    _context.Update(theCustomer);

                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CustomerExists(customer.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return Json(new { isSuccess = true, Message = "Cusotmer has been edited " });
        }

        // GET: Customers/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var customer = await _context.Customers
                .FirstOrDefaultAsync(m => m.Id == id);

            if (customer == null)
            {
                return NotFound();
            }

            _context.Remove(customer);
            await _context.SaveChangesAsync();
            return Json(new { isSuccess = true, Message = "Customer has been deleted" });
        }

        //// POST: Customers/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteConfirmed(int id)
        //{
        //    var customer = await _context.Customers.FindAsync(id);
        //    _context.Customers.Remove(customer);
        //    await _context.SaveChangesAsync();
        //    return RedirectToAction(nameof(Index));
        //}

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}
